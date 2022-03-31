import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { iif } from 'rxjs';
import { CategoryDTO } from 'src/app/Models/category.dto';
import { PostDTO } from 'src/app/Models/post.dto';
import { CategoryService } from 'src/app/Services/category.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss'],
})
export class PostFormComponent implements OnInit {

  allCategories!: CategoryDTO[];
  post: PostDTO;
  title: FormControl;
  description: FormControl;
  publication_date: FormControl;
  categories!: FormControl;

  postForm: FormGroup;
  isValidForm: boolean | null;

  private isUpdateMode: boolean;
  private validRequest: boolean;
  private postId: string | null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private formBuilder: FormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private localStorageService: LocalStorageService,
    private categoryService: CategoryService
  ) {

    this.loadCategories();

    this.isValidForm = null;
    this.postId = this.activatedRoute.snapshot.paramMap.get('id');
    this.validRequest = false;
    this.isUpdateMode = false;
    this.allCategories = [];
    this.post = new PostDTO('','', 0, 0, new Date());
    this.title = new FormControl(this.post.title, [Validators.required, Validators.maxLength(55)]);
    this.description = new FormControl(this.post.description, [Validators.required, Validators.maxLength(55)]);
    this.publication_date = new FormControl(new Date(), [Validators.required, Validators.pattern('[0-9]{4}[-][0-9]{2}[-][0-9]{2}$')]);
    this.categories = new FormControl([]);

    this.postForm = this.formBuilder.group({
      title: this.title,
      description: this.description,
      publication_date: this.publication_date,
      categories: this.categories,
    })
  }
  // TODO 13
  async ngOnInit(): Promise<void> {
    let errorResponse: any;

    if(this.postId){
      this.isUpdateMode = true;
      try{
        this.post = await this.postService.getPostById(this.postId);
        this.title.setValue(this.post.title);
        this.description.setValue(this.post.description);
        this.publication_date.setValue(this.post.publication_date);
        this.categories.setValue(this.post.categories);
        this.postForm = this.formBuilder.group({
          title: this.title,
          description: this.description,
          publication_date: this.publication_date,
          categories: this.categories,
        })
      } catch(error: any){
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
      
    }
  }

  async createPost(): Promise<boolean>{
    let errorResponse: any;
    let responseOK: boolean = false;
    const userId = this.localStorageService.get('user_id');
    if(userId){
      try{
        await this.postService.createPost(this.post);
        responseOK = true;
      }catch(error:any){
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
      await this.sharedService.managementToast(
        'postFeedback',
        responseOK,
        errorResponse
      )
      if(responseOK){
        this.router.navigateByUrl('posts');
      }
    }
    return responseOK;
    
  }

  async editPost(): Promise<boolean>{
    let errorResponse: any;
    let responseOK: boolean = false;
    if(this.postId){
      try{
        await this.postService.updatePost(this.postId, this.post);
        responseOK = true;
      } catch(error: any){
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }

      await this.sharedService.managementToast(
        'postFeedback',
        responseOK,
        errorResponse
      );
      if(responseOK){
        this.router.navigateByUrl('posts');
      }
    }
    return responseOK;
  }

  private async loadCategories(): Promise<void>{
    let errorResponse: any;

    let user_id = localStorage.getItem('user_id');
    if(user_id){
      try{
        this.allCategories = await this.categoryService.getCategoriesByUserId(user_id);
      }catch(error:any){
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    }
  }

  async savePost(){
    this.isValidForm = false;

    if (this.postForm.invalid) {
      return;
    }
    this.isValidForm = true;
    this.post = this.postForm.value;
    this.post.publication_date = new Date(this.post.publication_date);
    console.log(this.post)
    if(this.isUpdateMode){
      this.validRequest = await this.editPost();
    }else{
      this.validRequest = await this.createPost();
    }

  }

}
