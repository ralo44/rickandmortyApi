import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Character } from 'src/app/shared/components/interface/character.interface';
import { CharacterService } from 'src/app/shared/services/character.service';
import { take , filter} from "rxjs/operators";
import { ActivatedRoute, NavigationEnd, ParamMap, Router } from '@angular/router';
type RequestInfo = {
  next:string | null
}
@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent implements OnInit {
  characters:Character[] =[]
  
  info:RequestInfo={
    next:null,
  }
   showGoUpButton = false
  private pageNum= 1
  private query:string = '';
  private hideScrollHeight= 200
  private showScrollHeight=500

  constructor(
    @Inject(DOCUMENT) private document:Document,
    private characterService:CharacterService,
    private route:ActivatedRoute,
    private router:Router) 
    {
      this.onUrlChange()
    }


  ngOnInit(): void {
    // this.getDataFromService()
    this.getCharactersByQuery()
  }

  @HostListener('window:scroll', [])
  
  onWindowScroll():void{
    const yOffSet = window.pageYOffset
    if ((yOffSet || this.document.documentElement.scrollTop || this.document.body.scrollTop) > this.showScrollHeight) {
      this.showGoUpButton = true
    }else if(this.showGoUpButton && (yOffSet || this.document.documentElement.scrollTop || this.document.body.scrollTop) < this.hideScrollHeight){
      this.showGoUpButton = false
    }
  }
  onScrollDown():void{
    if (this.info.next) {
      this.pageNum++
      this.getDataFromService()
    }
  }
  onScrollTop():void{
    this.document.body.scrollTop = 0
    this.document.documentElement.scrollTop = 0 
  }
  
  private onUrlChange():void{
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe( () =>{
      this.characters=[]
      this.pageNum = 1
      this.getCharactersByQuery()
    })
  }
  private getCharactersByQuery():void{
    this.route.queryParams.pipe(take(1)).subscribe( (params: ParamMap) =>{
      console.log('PArams', params);
      this.query = params['q']
      this.getDataFromService()
    })
  }

  private getDataFromService():void{
    this.characterService.searchCharacters(this.query, this.pageNum)
    .pipe(take(1))
    .subscribe((res:any)=>{
      if (res?.results?.length) {
        const {info, results } = res
        this.characters = [... this.characters, ...results] 
        this.info = info
      }else{
        this.characters =[]
      }
    })
  }

}
