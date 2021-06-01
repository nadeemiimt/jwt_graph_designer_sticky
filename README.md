# jwt_graph_designer_sticky
Angular application with implementation of BPMN diagram, Sticky notes, Dynamic form from JSON and JSON Server JWT implementation

 1. Project creation and setup 
  - 1.1. Create a project using Angular CLI Tool (Angular 9) in the previously 
downloaded repository.
  - 1.2. Choose and integrate a theme/UI Library of your choice (justify your choice).
 
2. Invent a use case
Invent a use case where to apply an architectural pattern (give reasons for the chosen 
architecture)
The application should:
- 2.1. Required Pages  
a) Home  
b) Login (Note: Auth user with a static username and password)  
c) Admin (Note: These paths should be restricted based on the user auth status)  
• Dashboard  
• Diagram Designer  
• Dynamic Form  
- 2.2. Routing (+ Route Guards)  
- 2.3. NGRX state manager to share logined user data  
3. Integration of Diagram.js  
“Diagram.js is A toolbox for displaying and modifying diagrams on the web.”  
Reference documentation for the library can be found at the following url 
https://github.com/bpmn-io/diagram-js  
Integrate the library into the Diagram page. Our intention is also to see how the 
candidate integrates a javascript plugin into an Angular project.  
4. Generate a form based on a static json file  
We provide a json file that contains list of required fields. Your job is to render a form 
based on the fields in the json file. Also, just put a submit button at the end of the 
form to alert the form fields.  
Notes:
- All should be rendered as inputs.  
- There is no need to store values on backend.  
- Validate field value base on the validateAs property  
{
"fields": [
{
"name": "firstname",
"validateAs": "string"
},
{
"name": "lastname",
"validateAs": "string"
},
{
"name": "age",
"validateAs": "number"
},
{
"name": "email",
"validateAs": "email"
}
]


# Additional:
1. Sticky Notes
2. JSON Server with JWT token implementation
3. Dashboards

# SETUP:
- Run "npm install" in root directory.
- Run "npm run start" (For demo as after some time API will stop)
- To run API permanently for longer period please run below 2 commands in 2 cmd instances
  - "cd {Project root directory}\fakeserver & npm run start-auth" 
  - "cd {Project root directory} & ng serve"

# DEMO:
https://github.com/nadeemiimt/jwt_graph_designer_sticky/blob/master/DiagramStickyDemo.mp4

UI: url: http://localhost:4200
API URL: http://localhost:8000/api
Postman Collection: https://www.getpostman.com/collections/329852cd26d7ee43c277
UserName: iadmin
Password: iadmin
