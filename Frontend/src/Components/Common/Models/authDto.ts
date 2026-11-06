export interface EmployeeLoginDto {
    email: string;
    password: string;

}
export interface ForgotPasswordDto {
    email: string;
    
}
export interface ResetPassordDto{
    email:string,
    token:string,
    newPassword:string,
}