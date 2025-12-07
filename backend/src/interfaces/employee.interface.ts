export interface EmployeeData {
    UserID: number;
    RestaurantID: number;
    Salary: number;
    HireDate: Date | string;
    SupervisorID: number | null;
    EmployeeType: string;
}

