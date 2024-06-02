"use client";
import axios from 'axios';
import { useState, useEffect } from 'react';
import Head from 'next/head';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("use effect");
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (token && email) {
      axios.get("http://localhost:8080/get-all-posts", {
        params: { email:email },
        headers: { Authorization: `Bearer ${token}` }
      }).then((response) => {
        console.log(response);
        setBlogs(response.data);
      }).catch((error) => {
        setError('Error fetching blogs');
        console.error("There was an error!", error);
      });
    } else {
      setError('Missing token or email in localStorage');
    }
  }, []);

  return (
    <div>
      <Head>
        <title>Blog Page</title>
      </Head>
      <h1>Blog Page</h1>
      <div>
        {error ? (
          <p>{error}</p>
        ) : (
          blogs.map(blog => (
            <div key={blog.id}>
              <h2>{blog.query}</h2>
              {/* <p>{blog.description}</p> */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogPage;
