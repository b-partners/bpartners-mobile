# Get all ssm parameters from aws

API_URL=$(aws ssm get-parameters --names "/bpartners/mobile/${{ github.event.inputs.env }}/API_URL" --with-decryption --output text --query "Parameters[*].Value")
SUCCESS_URL=$(aws ssm get-parameters --names "/bpartners/mobile/${{ github.event.inputs.env }}/SUCCESS_URL" --with-decryption --output text --query "Parameters[*].Value")
FAILURE_URL=$(aws ssm get-parameters --names "/bpartners/mobile/${{ github.event.inputs.env }}/FAILURE_URL" --with-decryption --output text --query "Parameters[*].Value")
SWAN_URL=$(aws ssm get-parameters --names "/bpartners/mobile/SWAN_URL" --with-decryption --output text --query "Parameters[*].Value")
CLIENT_ID=$(aws ssm get-parameters --names "/bpartners/mobile/${{ github.event.inputs.env }}/SWAN_CLIENT_ID" --with-decryption --output text --query "Parameters[*].Value")
CLIENT_SECRET=$(aws ssm get-parameters --names "/bpartners/mobile/${{ github.event.inputs.env }}/SAWN_CLIENT_SECRET" --with-decryption --output text --query "Parameters[*].Value")
SENTRY_ENV=$(aws ssm get-parameters --names "/bpartners/mobile/${{ github.event.inputs.env }}/SENTRY_DEV" --with-decryption --output text --query "Parameters[*].Value")
SENTRY_DSN=$(aws ssm get-parameters --names "/bpartners/mobile/SENTRY_DSN" --with-decryption --output text --query "Parameters[*].Value")
AUTHORIZATION_ENDPOINT=$(aws ssm get-parameters --names "/bpartners/mobile/AUTHORIZATION_ENDPOINT" --with-decryption --output text --query "Parameters[*].Value")
TOKEN_ENDPOINT=$(aws ssm get-parameters --names "/bpartners/mobile/TOKEN_ENDPOINT" --with-decryption --output text --query "Parameters[*].Value")

# Create the env file
touch .env

echo API_URL=$API_URL >> .env
echo SUCCESS_URL=$SUCCESS_URL >> .env
echo FAILURE_URL=$FAILURE_URL >> .env
echo SWAN_URL=$SWAN_URL >> .env
echo CLIENT_ID=$CLIENT_ID >> .env
echo CLIENT_SECRET=$CLIENT_SECRET >> .env
echo SENTRY_ENV=$SENTRY_ENV >> .env
echo SENTRY_DSN=$SENTRY_DSN >> .env
echo AUTHORIZATION_ENDPOINT=$AUTHORIZATION_ENDPOINT >> .env
echo TOKEN_ENDPOINT=$TOKEN_ENDPOINT >> .env

