properties([pipelineTriggers([githubPush()])])

node {
    git url: 'https://github.com/idrisskhaled/gestion-employes-front', branch: 'dev'
}

pipeline {
    agent any
    environment {
         DOCKER_HUB_REPO = 'idrisskhaled96/gestion-employes-frontend'
         //IMAGE_TAG = 'latest'
         //PATH = "/OPT/SONARQUBE/BIN:${ENV.PATH}"
         //SONAR_PROJECT_KEY = "gestion-employes"
    }

    stages {
        stage('Clone repository') {
            steps {
                script {
                    checkout([$class: 'GitSCM'])
                }
            }
        }
            
        // stage('SonarQube Analysis') {
        //     steps {
        //         script {
        //             // Run SonarQube analysis
        //            withSonarQubeEnv('SonarQube') {
         //                sh "mvn -f pom.xml sonar:sonar -Dsonar.exclusions=**/*.java"
         //           }

        //        }
         //   }
        //}  

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
                            sh "docker logout"
                            sh 'echo $dockerHubPassword | docker login -u $dockerHubUser --password-stdin'
                            sh "docker push ${env.DOCKER_HUB_REPO}:${env.BUILD_NUMBER}"
                        }
                    }
                }
            }
        }

        // stage('Deploy to dev cluster') {
        //     steps {
        //         script {
        //             kubeconfig(credentialsId: 'k8s', serverUrl: 'https://10.0.0.4:6443') {
        //               sh 'kubectl apply -f deployment.yaml'

        //             }
        //         }
        //     }
        // }
    }
    
}
