import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{
    posts: Post[] = [];
    private postSub: Subscription;
    isloading = false;
    totalPosts = 0;
    postsPerPage = 2;
    currentPage = 1;
    pageSizeOptions = [1, 2, 5, 10];

    constructor(public postsService: PostsService) {}

    ngOnInit() {
        this.isloading = true;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
        this.postSub = this.postsService.getPostsUpdatListenner()
        .subscribe((postData: {posts: Post[], postCount: number}) => {
            this.isloading = false;
            this.totalPosts = postData.postCount;
            this.posts = postData.posts;
        });
    }

    onChangePage(pageData: PageEvent) {
        this.isloading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.postsPerPage = pageData.pageSize;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }

    ngOnDestroy() {
        this.postSub.unsubscribe();
    }

    onDelete(postId: string) {
        this.isloading = true;
        this.postsService.deletePost(postId).subscribe(() => {
            this.postsService.getPosts(this.postsPerPage, this.currentPage);
        });
    }
}