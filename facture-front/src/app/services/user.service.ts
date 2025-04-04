import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../Model/user';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient, private session:SessionService) {

  }

  public doRegistration(user: User){
    return this.http.post("http://localhost:8082/SpringMVC/user/add-user",user,{responseType:'text' as 'json'});
  }
  public doConnection(email:string,psw:string): Observable<User>{
    return this.http.get<User>("http://localhost:8082/SpringMVC/user/connection/"+email+"/"+psw);
  }

  public checkPsw(id:number,psw:string): Observable<Boolean>{
    return this.http.get<Boolean>("http://localhost:8082/SpringMVC/user/check-password/"+id+"/"+psw);
  }

  public updateUser(user: User){
    return this.http.put("http://localhost:8082/SpringMVC/user/modify-user",user,{responseType:'text' as 'json',headers: new HttpHeaders()});
  }

  public getUserFromLocalStorage(): User {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || !user.idUser) {
      throw new Error('User not found in localStorage'); // Throw an error if user is not found
    }
    return user;
  }

  // Exemple d'utilisation de la méthode dans un autre service :
  public getUserBadge(): string {
    const user = this.getUserFromLocalStorage();
    return user ? user.badge : ''; // Retourne le badge de l'utilisateur
  }

  // Vous pouvez remplacer vos appels à "getUser" avec cette méthode pour récupérer l'utilisateur localement
  public getUser(id: number): Observable<User> {
    const user = this.getUserFromLocalStorage(); // Ici, vous récupérez directement l'utilisateur depuis localStorage
    if (user && user.idUser === id) {
      return new Observable(observer => {
        observer.next(user); // Retourner l'utilisateur récupéré depuis le localStorage
        observer.complete();
      });
    } else {
      // Si l'utilisateur n'est pas trouvé ou ne correspond pas, vous pouvez faire un appel HTTP ou retourner un message d'erreur
      return this.http.get<User>("http://localhost:8082/SpringMVC/user/retrieve-user/" + id, {
        headers: new HttpHeaders()
      });
    }
  }

  public updateUserPassword(user: User){
    return this.http.put("http://localhost:8082/SpringMVC/user/change-password",user,{responseType:'text' as 'json',headers: new HttpHeaders()});
  }

  public getUsers(id:number): Observable<User[]>{

    return this.http.get<User[]>("http://localhost:8082/SpringMVC/user/retrieve-all-users/"+id,{headers: new HttpHeaders()});
  }

  public deleteUser(id : number,aid : number){
    return this.http.delete("http://localhost:8082/SpringMVC/user/remove-user/"+id+"/"+aid,{headers: new HttpHeaders()});
  }

  public sendMail(email:string) : Observable<string>{
    return this.http.get<string>("http://localhost:8082/SpringMVC/user/verificationmail/"+email,{responseType:'text' as 'json'})
  }

  public checkUser(email:string) : Observable<Boolean>{
    return this.http.get<Boolean>("http://localhost:8082/SpringMVC/user/checkUser/"+email)
  }

  public forgetPassword(user: User): Observable<boolean>{
    return this.http.post<boolean>("http://localhost:8082/SpringMVC/user/forgetPassword",user,{responseType:'text' as 'json'});
  }


}
