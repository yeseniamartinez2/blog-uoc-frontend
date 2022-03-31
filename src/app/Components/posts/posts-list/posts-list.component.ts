import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PostDTO } from 'src/app/Models/post.dto';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],
})
export class PostsListComponent {

  postsList!: PostDTO[];

  constructor(
    private postService: PostService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService
  ) {
    this.loadPosts();
  }
  // TODO 12

  async loadPosts(): Promise<void>{
    let errorResponse: any;
    let userId = localStorage.getItem("user_id");
    if(userId){
      try{
        this.postsList = await this.postService.getPostsByUserId(userId);
      } catch(error: any){
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    }
  }

  async createPost(){
    this.router.navigateByUrl("user/post/");
  }

  async updatePost(postId: string){
    this.router.navigateByUrl("user/post/" + postId)
  }

  async deletePost(postId: string){
    let errorResponse: any;

    let confirmation = confirm('Confirm delete the post with id: ' + postId + '.');
    if(confirmation){
      try{
        const rowsAffected = await this.postService.deletePost(postId);
        if(rowsAffected.affected > 0){
          this.loadPosts();
        }
      }catch(error: any){
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    }
  }

}
