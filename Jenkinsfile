node {
    def branch = "${env.BRANCH_NAME}".toLowerCase()
    stage('git') {
		git url: "https://macpersia@bitbucket.org/planty-assistant-devs/planty-assistant-fulfillment.git", branch: branch
	}
	
	stage('build & publish') {
        dir (path: './functions/') {
            nodejs(nodeJSInstallationName: 'nodejs-10.14.2', configId: 'my-npmrc') {
                sh "npm install"
                sh "npm run build"
                sh "cp package.json lib/"
                //sh "npm pack lib/"
                sh "npm publish lib/ --registry http://repo-nexus-service:8081/repository/npm-local/"
            }
        }
	}
}
