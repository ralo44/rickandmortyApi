import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,  } from '@angular/router';
import { Observable, } from 'rxjs';
import { take } from 'rxjs/operators';
import { Character } from 'src/app/shared/components/interface/character.interface';
import { CharacterService } from 'src/app/shared/services/character.service';

@Component({
  selector: 'app-character-details',
  templateUrl: './character-details.component.html',
  styleUrls: ['./character-details.component.scss']
})
export class CharacterDetailsComponent implements OnInit {
  character$:Observable<Character>

  constructor(
    private route:ActivatedRoute,
    private characterService:CharacterService,
    private location:Location
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(take(1)).subscribe( (params) =>{
      const id = params['id']
      this.character$ = this.characterService.getDetails(id)
    })
  }
  onGoBack():void{
    this.location.back()
    // window.history.back()
  }

}
