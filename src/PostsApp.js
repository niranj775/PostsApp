import { Component } from "react";
import "./PostsApp.css";
import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

class PostsApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      id: "",
      userId: "",
      title: "",
      body: "",
      errors: {
        userId: "",
        title: "",
        body: "",
      },
    };
    // console.log("constructor");
  }

  // Create Posts
  createPost = async () => {
    try {
      const { userId, title, body } = this.state;
      const { data } = await axios.post(API_URL, { userId, title, body });
      // console.log(post);
      const posts = [...this.state.posts];
      posts.push(data);
      this.setState({ posts, userId: "", title: "", body: "" });
    } catch (error) {
      console.log(error);
    }
  };

  // Read Posts

  getPosts = async () => {
    try {
      const { data } = await axios.get(API_URL);
      this.setState({ posts: data });
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    // console.log("componentDidMount");
    this.getPosts();
  }
  // Update Posts

  updatePost = async () => {
    try {
      const { id, userId, title, body } = this.state;
      const { data } = await axios.put(`${API_URL}/${id}`, {
        userId,
        title,
        body,
      });
      // console.log(data);
      const index = this.state.posts.findIndex((post) => post.id === id);
      const posts = [...this.state.posts];
      posts[index] = data;
      this.setState({ posts, id: "", userId: "", title: "", body: "" });
    } catch (error) {
      console.log(error);
    }
  };

  // Delete Posts

  deletePosts = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      this.setState({
        posts: this.state.posts.filter((post) => post.id !== id),
      });
    } catch (error) {
      console.log(error);
    }
  };

  handleChange = ({ target: { name, value } }) => {
    const errors = { ...this.state.errors };
    //Validation
    switch (name) {
      case "userId": {
        if (!value) errors.userId = "User id is required";
        else errors.userId = "";
        break;
      }

      case "title": {
        if (!value) errors.title = "Title is required";
        else errors.title = "";
        break;
      }

      case "body": {
        if (!value) errors.body = "Body id is required";
        else errors.body = "";
        break;
      }
    }
    this.setState({ [name]: value, errors });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    return this.state.id ? this.updatePost() : this.createPost();
    // console.log(this.state);
  };

  editPosts = (post) => this.setState({ ...post });
  // console.log(post);
  // this.setState({
  //   id: post.id,
  //   userId: post.userId,
  //   title: post.title,
  //   body: post.body,
  // });

  render() {
    // console.log("render");
    return (
      <>
        <h2>Posts Application</h2>
        <form onSubmit={this.handleSubmit}>
          {this.state.id && (
            <>
              <div>
                <label>Id: </label>
                <input value={this.state.id} disabled />
              </div>
              <br />
            </>
          )}
          <div>
            <label>User Id: </label>
            <input
              name="userId"
              type="number"
              placeholder="Enter the user id"
              value={this.state.userId}
              onChange={this.handleChange}
              required
            />
            <span> {this.state.errors.userId}</span>
          </div>
          <br />
          <div>
            <label>Title: </label>
            <input
              name="title"
              type="text"
              placeholder="Enter the title"
              value={this.state.title}
              onChange={this.handleChange}
              required
            />
            <span> {this.state.errors.title}</span>
          </div>
          <br />
          <div>
            <label>Body: </label>
            <input
              name="body"
              type="text"
              placeholder="Enter the body"
              value={this.state.body}
              onChange={this.handleChange}
              required
            />
            <span> {this.state.errors.body}</span>
          </div>
          <br />
          <button type="submit">{this.state.id ? "Update" : "Create"}</button>
        </form>
        <br />
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>USERID</th>
              <th>TITLE</th>
              <th>BODY</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map((post) => {
              return (
                <tr key={post.id}>
                  <td>{post.id}</td>
                  <td>{post.userId}</td>
                  <td>{post.title}</td>
                  <td>{post.body}</td>
                  <td>
                    <button onClick={() => this.editPosts(post)}>Edit</button>
                    <button onClick={() => this.deletePosts(post.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
  }
}

export default PostsApp;
