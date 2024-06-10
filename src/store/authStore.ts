import { makeAutoObservable } from "mobx";
import { AuthRefreshResponse, Authresponse, IUser } from "./../type";
import AuthService from "../API/Manager";
import axios from "axios";
import { API_URL } from "../API/helper";

class AuthStore {
    user = {} as IUser;
    isAuthenticated:boolean = false;
    isLoading:boolean = false
    constructor() {
        makeAutoObservable(this);
    }

    setIsAuthenticated(bool:boolean){
        this.isAuthenticated = bool
    }

    setUser(user:IUser){
        this.user = user
    }

    setLoading(bool:boolean){
        this.isLoading = bool
    }

   async login(username:string,email:string,password:string) {
        try{
            const response = await AuthService.login(username,email,password);
            localStorage.setItem('access_token',response.data.access_token);
            localStorage.setItem('refresh_token',response.data.refresh_token);
            this.setIsAuthenticated(true)
            this.setUser(response.data.user)
            
        }catch(e){
            if (axios.isAxiosError(e)) {
                console.log(e.response?.data?.message);
            } else {
                console.log('An unexpected error occurred');
            }
        }
    }

   async register(username:string,email:string,password:string) {
        try{
            const response = await AuthService.registration(username,email,password);
            localStorage.setItem('access_token',response.data.access_token);
            this.setIsAuthenticated(true)
            this.setUser(response.data.user)
          
        }catch(e){
            if (axios.isAxiosError(e)) {
                console.log(e.response?.data?.message);
              } else {
                console.log('An unexpected error occurred');
              }
            }
        }        
    

    async logout() {
        try{
            const response = await AuthService.logout();
            localStorage.removeItem('access_token');
            this.setIsAuthenticated(false)
            this.setUser({}as IUser)
           
        }catch(e){
            if (axios.isAxiosError(e)) {
                console.log(e.response?.data?.message);
            } else {
                console.log('An unexpected error occurred');
            }
        }
    }

    async checkAuth(){
        this.setLoading(true)
        console.log(this.isLoading)
        try{
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
                console.log('No refresh token available');
            }
            const response = await axios.post<AuthRefreshResponse>(`${API_URL}/auth/refresh`, null, {
                headers: {
                    'Authorization': `Bearer ${refreshToken}`
                },
                withCredentials: true
            });
            console.log(response.data)
            localStorage.setItem('access_token', response.data.access_token);
            this.setIsAuthenticated(true);
            this.setUser(response.data.data);
        } catch(e) {
            if (axios.isAxiosError(e)) {
                console.log(e.response?.data?.message);
            } else {
                console.log('An unexpected error occurred');
            }
        }finally{
            this.setLoading(false)
            console.log(this.isLoading)
        }
    }
    
}


export default new AuthStore();
