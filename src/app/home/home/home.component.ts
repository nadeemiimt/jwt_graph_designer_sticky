import { ChangeDetectionStrategy, Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Globals } from 'src/app/globals';
import { Note } from 'src/app/model/note';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
 // notes: any = [];
  notes: any;
  recognition: any;
  constructor(private el: ElementRef, private api: RestApiService, private globals: Globals, public router: Router) {
    if (this.globals.notesInServer) {
      this.notes =this.api.getNotes();
      // .subscribe(data => {
      //   this.notes = data ?? [{ id: 0, content: '' }];
      // });
    }
    else {
      this.notes = localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes') ?? "") : [{ id: 0, content: '' }];
    }
    // const { webkitSpeechRecognition }: IWindow = <IWindow><unknown>window;
    // this.recognition = new webkitSpeechRecognition();
    // this.recognition.onresult = (event: { results: { transcript: any; }[][]; }) => {
    //   console.log("you said",this.el.nativeElement.querySelectorAll(".content")[0]);
    //   this.el.nativeElement.querySelectorAll(".content")[0].innerText = event.results[0][0].transcript

    // };
  }
  ngOnInit(): void {
    this.api.isLoggedIn().subscribe((res:any) =>  // handle memory leak in ondestroy, similar for all places
      {
        if(!res)
        {
          this.router.navigate(['login']);
        }
      })
  }
  updateAllNotes() {
    let notes = document.querySelectorAll('app-note');

    if (this.globals.notesInServer) {
      notes.forEach((data: any) => {
        this.api.updateNote({id: data.id, content: data?.querySelector('.content')?.innerHTML });
      });
    }
    else {
      notes.forEach((note, index) => {
        this.notes[note.id].content = note?.querySelector('.content')?.innerHTML;
      });
      localStorage.setItem('notes', JSON.stringify(this.notes));
    }
  }

  addNote() {
    if (this.globals.notesInServer) {
      let note: Note = {
        content: ""
      }
      this.notes = this.api.saveNote(note);
      // .subscribe(data => {
      //   this.notes = data;
      // });
    }
    else {
      this.notes.push({ id: this.notes.length + 1, content: '' });
      // sort the array
      this.notes = this.notes.sort((a: any, b: any) => { return b.id - a.id });
      localStorage.setItem('notes', JSON.stringify(this.notes));
    }
  };

  saveNote(event: any) {
    console.log('saveNote', event.srcElement.parentElement)
    console.log('saveNote', event.srcElement.parentElement.parentElement)
    console.log('saveNote', event.srcElement.parentElement.parentElement.parentElement)
    let id = event.srcElement.parentElement.parentElement.getAttribute('id');
    let content = event.target.innerText;
    if(!id)   // for mic 
    {
      id = event.srcElement.parentElement.parentElement.parentElement.getAttribute('id');
      content = event.srcElement.parentElement.parentElement.querySelector(".content").innerText;
    }
    event.target.innerText = content;
    const json = {
      'id': id,
      'content': content
    }

    if (this.globals.notesInServer) {
      this.notes = this.api.updateNote(json);
      // .subscribe(data => {
      //   this.notes = data;
      // });
    }
    else {
      this.updateNote(json);
      localStorage.setItem('notes', JSON.stringify(this.notes));
    }
    console.log("********* updating note *********")
  }

  updateNote(newValue: any) {
    this.notes.forEach((note: any, index: any) => {
      if (note.id == newValue.id) {
        this.notes[index].content = newValue.content;
      }
    });
  }

  deleteNote(event: any) {
    const id = event.srcElement.parentElement.parentElement.parentElement.getAttribute('id');
    if (this.globals.notesInServer) {
      this.notes = this.api.deleteNote(id);
      // .subscribe(data => {
      //   this.notes = data;
      // });
    }
    else {
      this.notes.forEach((note: any, index: any) => {
        if (note.id == id) {
          this.notes.splice(index, 1);
          localStorage.setItem('notes', JSON.stringify(this.notes));
          console.log("********* deleting note *********")
          return;
        }
      });
    }
  }

  record(event: any) {
    this.recognition.start();
    this.addNote();
  }


}


export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}

