properties([pipelineTriggers([githubPush()])])

node {
    git url: 'https://github.com/idrisskhaled/gestion-employes-front', branch: 'dev'
}

pipeline {
    agent any
    environment {
         DOCKER_HUB_REPO = 'idrisskhaled96/gestion-employes-frontend'
         //PATH = "/OPT/SONARQUBE/BIN:${ENV.PATH}"
         //SONAR_PROJECT_KEY = "gestion-employes"
    }

    stages {
        stage('Clone repository') {
            steps {
                script {
                    checkout scm
                }
            }
        }

        stage('Test with Jest') {
            steps {
                script {
                    sh 'npm install --force'
                    sh 'node --version'
                    sh 'npm run test'
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                        sh "docker build -t ${env.DOCKER_HUB_REPO}:${env.BUILD_NUMBER} ."
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub', passwordVariable: 'dockerHubPassword', usernameVariable: 'dockerHubUser')]) {
                        withDockerRegistry([url: 'https://index.docker.io/v1/']) {
                            sh 'echo $dockerHubPassword | docker login -u $dockerHubUser --password-stdin'
                            sh "docker push ${env.DOCKER_HUB_REPO}:${env.BUILD_NUMBER}"
                        }
                    }
                }
            }
        }

         stage('Deploy to dev cluster') {
             steps {
                 script {
                     withCredentials([azureServicePrincipal(credentialsId: 'azure', servicePrincipalId: AZURE_CLIENT_ID, servicePrincipalKey: AZURE_CLIENT_ID, tenant: AZURE_TENANT_ID)]) {
                        sh "az login --service-principal --tenant $AZURE_TENANT_ID --username $AZURE_CLIENT_ID --password $AZURE_CLIENT_SECRET"
                    }
                     sh "az account set --subscription e17aee72-105c-4866-a453-005f07809bd2"
                     sh "az aks get-credentials --resource-group gestion-employes --name gestion-employes-dev"
                     sh "kubectl set image deployment/frontend frontend=idrisskhaled96/gestion-employes-frontend:${env.BUILD_NUMBER}"
                 }
             }
         }

        stage('Logout') {
            steps {
                script {
                    sh "docker logout"
                    sh "az logout"
                }
            }
        }
    }
    
}
