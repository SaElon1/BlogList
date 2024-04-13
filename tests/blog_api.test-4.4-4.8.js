const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')

const Blog = require('../models/blog')
const { json } = require('express')


describe('When there is initially some blogs saved', () => {
beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.testBlogs)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.testBlogs.length)
})
})

describe('addition of a new blog', () => {
test('a valid blog can be added', async () => {
    const newBlog = {
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
    }
    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.testBlogs.length + 1)

    const blogTitles = blogsAtEnd.map(blog => blog.title)
    expect(blogTitles).toContain('TDD harms architecture')
})
})

describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () =>{
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]
        

        await api
        .delete(`/api/blogs/${blogToDelete._id}`)
        .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

        const blogsAtEndIds = blogsAtEnd.map(blog => blog._id)
        expect(blogsAtEndIds).not.toContain(blogToDelete._id)
    })

})

afterAll(async () => {
    mongoose.connection.close()
})


