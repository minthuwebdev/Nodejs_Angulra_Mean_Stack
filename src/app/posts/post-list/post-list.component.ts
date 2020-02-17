import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

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

    constructor(public postsService: PostsService) {}

    ngOnInit() {
        this.isloading = true;
        this.postsService.getPosts();
        this.postSub = this.postsService.getPostsUpdatListenner()
        .subscribe((posts: Post[]) => {
            this.isloading = false;
            this.posts = posts;
        });
    }

    ngOnDestroy() {
        this.postSub.unsubscribe();
    }

    onDelete(postId: string) {
        this.postsService.deletePost(postId);
    }


}