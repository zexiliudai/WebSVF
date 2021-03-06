# **<p align="center">SVF ANALYSIS TOOLS</p>**

## **Install Guide**

### **AWS**

### **Docker**
- **Uninstall previous versions of Docker: `sudo apt-get remove docker docker-engine docker.io containerd runc`**
- **Install packages: `sudo apt-get install \
                        apt-transport-https \
                        ca-certificates \
                        curl \
                        gnupg-agent \
                        software-properties-common`**
- **Add Docker Official GPG key: `curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -`**
- **Install Docker Engine: `sudo apt-get update sudo apt-get install docker-ce docker-ce-cli containerd.io`**
- **Verify Docker Engine is installed correctly: `sudo docker run hello-world`**
### **Local**
- **Step 1. Install development tools.**
    - **git**. **[The git download link](https://code.visualstudio.com/)**
    - **nodejs**. **[The nodejs download link](https://nodejs.org/zh-cn/download/)**
    - **yarn**. **[The yarn download link](https://classic.yarnpkg.com/en/docs/install/#windows-stable)**
    - **vscode**. **[The vscode download link](https://code.visualstudio.com/)**
- **Step 2. Prepare development environment.**
    - **cmd: `git clone https://github.com/SVF-tools/WebSVF.git --depth 1`**  
    - **cmd: `cd ./WebSVF/src/SVFTOOLS`**  
    - **cmd: `yarn`**  
    - **cmd: `code .`**  
<img src='https://github.com/SVF-tools/WebSVF/blob/master/docs/env.gif?raw=true' width='720'/>

- **Step 3. Generate extension**
    - **keyboard (for open vscode terminal):**  
        - **Linux: [ Ctrl + shift + `]**  
        - **Mac: [ ^ + ⇧ + ` ]**
    - **cmd: `sudo npm install -g vsce`** 
    - **cmd: `vsce package`**  
It will generate a extension named: **svftools-[version].vsix**
<img src='https://github.com/SVF-tools/WebSVF/blob/master/docs/vsce.gif?raw=true' width='720'/>

- **To Compile:**   
    - **cmd: `yarn compile`**  
- **To Debug:**  
    - **keyboard: [ _F5_ ]**  

- **How to install extension ?**
<img src='https://github.com/SVF-tools/WebSVF/blob/master/docs/vsix_install.png?raw=true' width='720'/>

### **User Guide**

### **Online**

### **Operation**

## **Dev Guide**

### **Preparing AWS environment for WebSVF docker images**
**Amazon Elastic Container Service (ECS) is used to run WebSVF Docker containers.**

The following points show steps on how to install websvf on AWS (as a developer) using Amazon ECS and WebSVF Docker container.

**Please note that creating cluster is only a one-time process. Creating new tasks and updating task-definition are done programmatically using AWS SDK for Javascript.**

- **Log in to the AWS console and go to Elastic Container Service**
- **Once ECS is open, click on Task definitions. Then click on “create task definition”**
- **You will then be prompted to select between EC2 and Fargate. Select EC2**
    - Enter the details as below:
      -	Task Definition Name: <Name of your choice>
      -	Requires Compatibilities: EC2
      -	Task Role: <Leave Blank> i.e. None
      -	Network Mode: <default>
      -	Task Execution Role: Create New Role
      -	Task Memory: 300 (or more)
      -	Task CPU: 200 (or more)
  
  
- **Still on the Create Task Definition Page, click on “Add container”. This is where you specify what container needs to run**
    - Enter the details as below (rest of the field can be left as default):
      -	Container name: <Name of your choice>
      -	Image: winoooops/websvf-docker
      -	Container port: 8080
  
- **Once your Task definition is ready, we need to create a cluster. Click on “cluster” from the left and then click on “Create Cluster”. Select the below option for each prompt respectively. Some options while creating cluster are not mentioned below because they can have the default value**
  -	Select Cluster template
    -	EC2 Linux + Networking
  -	Configure Cluster
    -	Cluster name: name of your choice
    -	EC2 instance Type: t2.medium
    -	Keypair: Select an existing keypair or create a new one (do not leave as “None”)
    -	VPC: Select VPC if one exists, or create a new VPC
    -	Subnets: <add all subnets from the dropdown>
    -	Security group: Create a new security group if you do not have one
    -	Assigned Security group needs to have all TCP allowed from anywhere
    -	Container Instance IAM role: Create new role

- **After your cluster and task definition have been set, you will need to go to EC2 service sure that the Launch template has been set.**
  - From your EC2 Dashboard, click on Launch template. There should be a Launch template that has been created by ECS automatically. Usually named as “EC2ConatinerService-<clustername>-….”
  
  - **If the launch template is there, just test things, launch a new instance from template (using ECS template) and see if that instance appears within your ECS cluster (can be seen under the ECS instances tab) by matching the EC2 Instance Ids.**
  
  - **The ECS cluster is now ready for use. The tasks (WebSVF containers) are programmatically created upon user signup.**

