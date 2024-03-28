// controllers/routes.js
import express from 'express';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

const router = express.Router();
// provides location of blog.json
const blogDataPath = path.join(process.cwd(), 'api', 'blog.json');

// Function to retrieve blog data from the JSON file
function getBlogData() {
    // Check if the blog data file exists
    if (existsSync(blogDataPath)) {
        // Read the raw data from the blog data file
        const rawData = readFileSync(blogDataPath, 'utf8');
        // Parse the raw data into a JavaScript object and return it
        return JSON.parse(rawData);
    }
    // If the file does not exist, return empty array
    return [];
}

// Function to save blog data back to the file
function saveBlogData(data) {
    writeFileSync(blogDataPath, JSON.stringify(data, null, 2), 'utf8');
}

// Route to get all blog posts
router.get('/blogs', (req, res) => {
    const blogData = getBlogData();
    res.json(blogData);// send data as json to client
});

// Route to create a new blog post
router.post('/blogs', (req, res) => {
    const { title, author, body } = req.body;
    // check for missing fields
    if (!title || !author || !body) {
        // conditional for missing fields
        return res.status(400).send('Missing required fields');
    }
    const blogData = getBlogData();
    // create new object w/ ID
    // uses total number of posts in array +1 to give each a unique ID
    const newPost = { post_id: blogData.length + 1, title, author, body };
    blogData.push(newPost);
    saveBlogData(blogData);
    // confirming creation
    res.status(201).json(newPost);
});

// Route to get a single blog post by id
router.get('/blogs/:id', (req, res) => {
    //id parameter from the request URL into an integer
    const postId = parseInt(req.params.id);
    const blogData = getBlogData();
    // searches thru data for post w/ that ID, stores variable in `post`
    const post = blogData.find(p => p.post_id === postId);
    if (!post) { // checking if the variable post does not contain any value 
        // indicating that the requested blog post was not found / does not exist
        return res.status(404).send('Blog post not found');
    }
    res.json(post); //sends the post as a JSON response
});

// Route to update an existing blog post by id
router.put('/blogs/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    let blogData = getBlogData();
    // checking if post exists
    const postIndex = blogData.findIndex(p => p.post_id === postId);
    if (postIndex === -1) {
        return res.status(404).send('Blog post not found');
    }
    // Update the post with request data, ensuring post_id remains unchanged
    blogData[postIndex] = { ...blogData[postIndex], ...req.body, post_id: postId };
    saveBlogData(blogData);
    // sends post found at the ID in the blogData as a JSON response
    res.json(blogData[postIndex]); 
});

// Route to delete a blog post by id
router.delete('/blogs/:id', (req, res) => {
    const postId = parseInt(req.params.id); //id parameter from the request URL into an integer
    let blogData = getBlogData(); // retrieves the blog data from the JSON file, storing it in the variable blogData
    // searches through the blog data to find the index of the post with the matching post ID
    const postIndex = blogData.findIndex(p => p.post_id === postId);
    // checking if the post exists
    if (postIndex === -1) {
        return res.status(404).send('Blog post not found');
    }
    // Remove the post from the array
    blogData = blogData.filter(p => p.post_id !== postId);
    saveBlogData(blogData);
    // Respond with no content to indicate successful deletion
    res.status(204).send();
});

export default router;
