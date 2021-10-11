const loginRules = {
    email: 'required|email',
    password: 'required',
};

const resetRules = {
    email: 'required|email'
};

const employeeRules = {
    firstname: 'required|min:3',
    lastname: 'required|min:3',
    email: 'required|email',
    deptId: 'required',
    jobtitle: 'required|min:3'
};

const companyRules = {
    companyName: 'required|min:3',
    companyEmail: 'required|email',
    password: 'required|min:5',
};

const updateRules = {
    companyName: 'required|min:3',
    logoUrl: 'required|min:3',
    contactNo: 'required|min:8',
    address: 'required|min:5',
    employeeSize: 'required',
    state: 'required',
    country: 'required'
}

const trainingRules = {
    companyId: 'required',
    topic: 'required',
    description: 'required',
    unitCost: 'required',
    location: 'required',
    status: 'required',
}
const updateTrainingRules = {
    topic: 'required',
    description: 'required',
    unitCost: 'required',
    location: 'required',
    status: 'required',
}
export { loginRules, resetRules, employeeRules, companyRules, updateRules, trainingRules, updateTrainingRules }