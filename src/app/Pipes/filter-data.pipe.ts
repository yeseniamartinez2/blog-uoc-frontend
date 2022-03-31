import { Pipe, PipeTransform } from '@angular/core';
import { PostDTO } from '../Models/post.dto';

@Pipe({
  name: 'filterDataPipe'
})
export class FilterDataPipe implements PipeTransform {

  transform(value: PostDTO[], input: string): PostDTO[] {
    const postsFiltered: PostDTO[] = [];
    for(let post of value){
      if(post.title.toLowerCase().indexOf(input.toLowerCase()) > -1 ||
         post.userAlias.toLowerCase().indexOf(input.toLowerCase()) > -1){
        postsFiltered.push(post);
      }
    }
    return postsFiltered;
  }

}
