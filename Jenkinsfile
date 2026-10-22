pipeline {
  agent any

  options {
    disableConcurrentBuilds()
    timeout(time: 30, unit: 'MINUTES')
    ansiColor('xterm')
  }

  parameters {
    string(
      name: 'VERSION',
      defaultValue: '1.0.0',
      description: 'Image tag version (e.g. 1.0.0, 1.0.1, 2.0.0)',
      trim: true
    )
    string(
      name: 'PORT',
      defaultValue: '3005',
      description: 'Host port for frontend service',
      trim: true
    )
    string(
      name: 'API_BASE_URL',
      defaultValue: 'https://api-portofolio.devlabhub.id',
      description: 'Backend API URL baked into frontend build',
      trim: true
    )
  }

  environment {
    SERVER_HOST            = '100.87.90.67'
    SERVER_USER            = 'devlabhub'
    SSH_CREDENTIAL         = 'homeserver-ssh'
    SONAR_CREDENTIAL       = 'sonar-devlabhub'
    API_SECRET_CREDENTIAL  = 'portfolio-api-secret'

    APP_NAME               = 'portfolio-frontend'
    DEPLOY_DIR             = '/home/devlabhub/projects/portfolio-frontend'
    FRONTEND_CONTAINER     = 'portfolio-frontend'
    FRONTEND_IMAGE         = 'portfolio-frontend'

    VERSION_TAG            = "${params.VERSION}"
    PORT_FE                = "${params.PORT}"
    ACTUAL_API_URL         = "${params.API_BASE_URL}"

    SONAR_HOST_URL         = 'http://127.0.0.1:9002'
    HEALTHCHECK_PATH       = '/healthz'
  }

  stages {

    stage('Validate Inputs') {
      steps {
        script {
          if (!(env.VERSION_TAG ==~ /^[A-Za-z0-9][A-Za-z0-9_.-]{0,63}$/)) {
            error('VERSION must be a safe alphanumeric container image tag.')
          }
          if (!(env.PORT_FE ==~ /^[0-9]{2,5}$/)) {
            error('PORT must be a valid port number.')
          }
        }
      }
    }

    stage('Checkout SCM') {
      steps {
        checkout scm
      }
    }

    stage('Test Homeserver Connection') {
      steps {
        withCredentials([
          sshUserPrivateKey(
            credentialsId: env.SSH_CREDENTIAL,
            keyFileVariable: 'SSH_KEY',
            usernameVariable: 'SSH_USER'
          )
        ]) {
          sh '''
            set -eu
            SSH_OPTS="-i ${SSH_KEY} -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR"
            echo "Testing SSH connection to homeserver ${SERVER_HOST}..."
            ssh ${SSH_OPTS} ${SSH_USER}@${SERVER_HOST} "echo '=== Connected to Homeserver ===' && hostname && whoami && podman --version"
          '''
        }
      }
    }

    stage('Sync Workspace') {
      steps {
        withCredentials([
          sshUserPrivateKey(
            credentialsId: env.SSH_CREDENTIAL,
            keyFileVariable: 'SSH_KEY',
            usernameVariable: 'SSH_USER'
          )
        ]) {
          sh '''
            set -eu
            SSH_OPTS="-i ${SSH_KEY} -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR"

            echo "Streaming frontend codebase to ${DEPLOY_DIR}..."
            ssh ${SSH_OPTS} ${SSH_USER}@${SERVER_HOST} "mkdir -p ${DEPLOY_DIR}"
            tar --exclude=.git --exclude=node_modules --exclude=.next --exclude=dist --exclude=*.log -czf - . | \
              ssh ${SSH_OPTS} ${SSH_USER}@${SERVER_HOST} "tar -xzf - -C ${DEPLOY_DIR}"
            echo "Workspace successfully synced to ${DEPLOY_DIR}"
          '''
        }
      }
    }

    stage('Unit Test & Coverage') {
      steps {
        withCredentials([
          sshUserPrivateKey(
            credentialsId: env.SSH_CREDENTIAL,
            keyFileVariable: 'SSH_KEY',
            usernameVariable: 'SSH_USER'
          )
        ]) {
          sh '''
            set -eu
            SSH_OPTS="-i ${SSH_KEY} -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR"

            echo "=== Running Frontend Tests & Coverage in Ephemeral Container ==="
            ssh ${SSH_OPTS} ${SSH_USER}@${SERVER_HOST} "bash -s" <<REMOTE
set -eu
podman run --rm \
  -v ${DEPLOY_DIR}:/app:Z \
  -w /app \
  docker.io/library/node:20-slim \
  sh -c 'npm ci --legacy-peer-deps && (npm run test:cov || npm run test:coverage || npm run test || npm run lint)'
REMOTE

            echo "=== Pulling coverage report to Jenkins workspace ==="
            ssh ${SSH_OPTS} ${SSH_USER}@${SERVER_HOST} "tar -czf - -C ${DEPLOY_DIR} coverage 2>/dev/null" | tar -xzf - 2>/dev/null || true
          '''
        }
      }
    }

    stage('SonarQube Scanner') {
      steps {
        withCredentials([
          sshUserPrivateKey(
            credentialsId: env.SSH_CREDENTIAL,
            keyFileVariable: 'SSH_KEY',
            usernameVariable: 'SSH_USER'
          ),
          string(
            credentialsId: env.SONAR_CREDENTIAL,
            variable: 'SONAR_TOKEN'
          )
        ]) {
          sh '''
            set -eu
            SSH_OPTS="-i ${SSH_KEY} -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR"

            echo "=== Running SonarQube Scanner CLI on Homeserver ==="
            ssh ${SSH_OPTS} ${SSH_USER}@${SERVER_HOST} "bash -s" <<REMOTE
set -eu
mkdir -p ${DEPLOY_DIR}/.scannerwork

podman run --rm --network host \
  -v ${DEPLOY_DIR}:/usr/src:Z \
  -w /usr/src \
  -e SONAR_HOST_URL="${SONAR_HOST_URL}" \
  -e SONAR_TOKEN="${SONAR_TOKEN}" \
  docker.io/sonarsource/sonar-scanner-cli:latest \
  sonar-scanner \
    -Dsonar.host.url="${SONAR_HOST_URL}" \
    -Dsonar.token="${SONAR_TOKEN}" \
    -Dsonar.working.directory=/usr/src/.scannerwork \
    -Dsonar.ws.timeout=300
REMOTE

            echo "=== Pulling SonarQube report-task.txt to Jenkins workspace ==="
            ssh ${SSH_OPTS} ${SSH_USER}@${SERVER_HOST} "tar -czf - -C ${DEPLOY_DIR} .scannerwork 2>/dev/null" | tar -xzf - 2>/dev/null || true
          '''
        }
      }
    }

    stage('Build Container Image') {
      steps {
        withCredentials([
          sshUserPrivateKey(
            credentialsId: env.SSH_CREDENTIAL,
            keyFileVariable: 'SSH_KEY',
            usernameVariable: 'SSH_USER'
          ),
          string(
            credentialsId: env.API_SECRET_CREDENTIAL,
            variable: 'ACTUAL_SECRET'
          )
        ]) {
          sh '''
            set -eu
            SSH_OPTS="-i ${SSH_KEY} -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR"

            echo "=== Building Frontend Image with Baked API URL ==="
            ssh ${SSH_OPTS} ${SSH_USER}@${SERVER_HOST} "bash -s" <<REMOTE
set -eu
cd ${DEPLOY_DIR}
podman build \
  --build-arg VITE_API_BASE_URL="${ACTUAL_API_URL}" \
  --build-arg VITE_API_ENCRYPTION_SECRET="${ACTUAL_SECRET}" \
  -t "${FRONTEND_IMAGE}:${VERSION_TAG}" \
  -f Dockerfile \
  .
REMOTE
          '''
        }
      }
    }

    stage('Deploy Frontend Container') {
      steps {
        withCredentials([
          sshUserPrivateKey(
            credentialsId: env.SSH_CREDENTIAL,
            keyFileVariable: 'SSH_KEY',
            usernameVariable: 'SSH_USER'
          ),
          string(
            credentialsId: env.API_SECRET_CREDENTIAL,
            variable: 'ACTUAL_SECRET'
          )
        ]) {
          sh '''
            set -eu
            SSH_OPTS="-i ${SSH_KEY} -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR"

            echo "=== Deploying Container with Host Network on Port ${PORT_FE} ==="
            ssh ${SSH_OPTS} ${SSH_USER}@${SERVER_HOST} "bash -s" <<REMOTE
set -eu
podman rm -f "${FRONTEND_CONTAINER}" 2>/dev/null || true
podman run -d \
  --name "${FRONTEND_CONTAINER}" \
  --restart always \
  --network host \
  -e PORT="${PORT_FE}" \
  -e VITE_API_BASE_URL="${ACTUAL_API_URL}" \
  -e VITE_API_ENCRYPTION_SECRET="${ACTUAL_SECRET}" \
  "${FRONTEND_IMAGE}:${VERSION_TAG}"
REMOTE
          '''
        }
      }
    }

    stage('Health Check') {
      steps {
        withCredentials([
          sshUserPrivateKey(
            credentialsId: env.SSH_CREDENTIAL,
            keyFileVariable: 'SSH_KEY',
            usernameVariable: 'SSH_USER'
          )
        ]) {
          sh '''
            set -eu
            SSH_OPTS="-i ${SSH_KEY} -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR"

            echo "=== Polling Frontend Health Check Endpoint ==="
            ssh ${SSH_OPTS} ${SSH_USER}@${SERVER_HOST} "bash -s" <<REMOTE
set -eu
URL="http://127.0.0.1:${PORT_FE}${HEALTHCHECK_PATH}"
echo "Checking \$URL..."
for i in \$(seq 1 30); do
  STATUS=\$(curl --silent --output /dev/null --write-out '%{http_code}' "\$URL" || true)
  if [ "\$STATUS" = "200" ]; then
    echo "✓ Frontend health check passed on attempt \$i (HTTP 200)"
    exit 0
  fi
  echo "Attempt \$i: HTTP status \$STATUS. Retrying in 2 seconds..."
  sleep 2
done
echo "✗ Frontend health check failed after 60 seconds"
podman logs --tail 50 "${FRONTEND_CONTAINER}" 2>/dev/null || true
exit 1
REMOTE
          '''
        }
      }
    }

    stage('Prune Dangling Images') {
      steps {
        withCredentials([
          sshUserPrivateKey(
            credentialsId: env.SSH_CREDENTIAL,
            keyFileVariable: 'SSH_KEY',
            usernameVariable: 'SSH_USER'
          )
        ]) {
          sh '''
            set -eu
            SSH_OPTS="-i ${SSH_KEY} -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR"
            ssh ${SSH_OPTS} ${SSH_USER}@${SERVER_HOST} "podman image prune -f 2>/dev/null || true"
          '''
        }
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'coverage/**, .scannerwork/**', allowEmptyArchive: true
      cleanWs deleteDirs: true, notFailBuild: true
    }
    success {
      echo '''
======================================================
  PORTFOLIO FRONTEND CI/CD DEPLOYMENT SUCCEEDED
======================================================
'''
    }
    failure {
      echo '''
======================================================
  PORTFOLIO FRONTEND CI/CD DEPLOYMENT FAILED
======================================================
'''
    }
  }
}
