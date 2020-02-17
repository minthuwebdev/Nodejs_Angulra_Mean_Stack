import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts() {
    this.http.get<{ message: string, posts: any }>("http://localhost:3000/api/posts")
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
          }
        })
      }))
      .subscribe((transformedPost) => {
        this.posts = transformedPost;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostsUpdatListenner() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{_id: string, title: string, content: string, imagePath: string} >(
      "http://localhost:3000/api/posts/" + id
    );
  }


  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http.post<{ message: string, post: Post }>(
      "http://localhost:3000/api/posts", 
      postData
      )
      .subscribe((responsedData) => {
        const post: Post = {
          id: responsedData.post.id, 
          title: responsedData.post.title, 
          content: responsedData.post.content,
          imagePath: responsedData.post.imagePath

        };
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if(typeof(image) === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      } 
    }
    this.http.put("http://localhost:3000/api/posts/" + id, postData)
    .subscribe((response) => {
      const updatedPost = [...this.posts];
      const oldPostIndex = updatedPost.findIndex(p => p.id === id);
      const post: Post = {
        id: id,
        title: title,
        content: content,
        imagePath: ""
      }
      updatedPost[oldPostIndex] = post;
      this.posts = updatedPost;
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    });
  }

  deletePost(postId: string) {
    this.http.delete("http://localhost:3000/api/posts/" + postId)
    .subscribe(() => {
      const upatedPosts = this.posts.filter(post => post.id !== postId);
      this.posts = upatedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

}