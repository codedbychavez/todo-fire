// app.component.ts
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TaskService } from "./task.service";
import { AngularFirestore } from '@angular/fire/firestore';
import { config } from './app.config';
import { Task } from './app.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  tasks: Observable<any[]>;
  myTask: string;
  editMode: boolean = false;
  taskToEdit: any = {};

  constructor(public db: AngularFirestore, private taskService: TaskService) {
  }

  ngOnInit(): void {
    this.tasks = this.db.collection(config.collection_endpoint)
    .snapshotChanges()
    .pipe(
      map(actions => {
        return actions.map(a => {
          // retrieve the data from the task document in firestore
          const data = a.payload.doc.data() as Task;
          // retrieve document id for that task
          const id = a.payload.doc.id;
          // Use spread operator to add the id to the task document data
          return { id, ...data }
        });
      })
    )
  }

  edit(task) {
    console.log(task);
    // Assign the taskToEdit and turn on editMode
    this.taskToEdit = task;
    this.editMode = true;
    // Set form value
    this.myTask = task.description;
  }

  saveTask() {
    if (this.myTask !== null) {
       // retrieve the input field value
       let task = {
          completed: false,
          description: this.myTask
       };
       if (!this.editMode) {
          console.log(task);
          this.taskService.addTask(task);
       } else {
          // retrieve the task id
          let taskId = this.taskToEdit.id;
          // call the task service to update the task
          this.taskService.updateTask(taskId, task);
       }
       // reset the edit mode to false and clear form
       this.editMode = false;
       this.myTask = "";
    }
 }

 updateCompletedStatus(event, task) {
  let completedStatus = event.target.checked
  this.taskToEdit = task;

  let updatedTask = {
    completed: completedStatus
  };
  // retrieve the task id
  let taskId = this.taskToEdit.id
  
  this.taskService.updateTask(taskId, updatedTask);
  }

  deleteTask(task) {
    // retrieve the task id
    let taskId = task.id;
    // call the task service to delete the task
    this.taskService.deleteTask(taskId);
  }
}


      