import { Injectable } from '@angular/core';
import { config } from './app.config'
import { Task } from './app.model'

import {
  AngularFirestoreDocument,
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore'

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  tasks: AngularFirestoreCollection<Task>;
  private taskDoc: AngularFirestoreDocument<Task>;

  constructor(private db: AngularFirestore) {
    // retrieve the task collection
    this.tasks = db.collection<Task>(config.collection_endpoint);
   }

   addTask(task) {
    //  add a new task to the collection
    this.tasks.add(task)
   }

   updateTask(id, update) {
    // retrieve the task document
    // this.taskDoc = this.db.doc<Task>(`${config.collection_endpoint}/${id}`);
    this.taskDoc = this.db.doc<Task>(config.collection_endpoint+'/'+id);
    // update the task document
    this.taskDoc.update(update);
 }

   deleteTask(id) {
    // retrieve the task document
    this.taskDoc = this.db.doc<Task>
    (`${config.collection_endpoint}/${id}`);
    // delete the document
    this.taskDoc.delete();
   } //deleteTask
}
