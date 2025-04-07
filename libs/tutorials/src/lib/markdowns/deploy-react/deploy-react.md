# Auto Deploy React App to AWS

## Steps

### Step 1: Push React App to GitHub

### Step 2: Create a S3 bucket in AWS

- Enter a bucket name and create with default settings
- Go to the bucket created, under permissions turn off `Block public access` and attach a bucket policy to enable public read access to all bucket objects

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicRead",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::{bucket-name-placeholder}/*"
        }
    ]
}
```

- Go under bucket properties, enabled static website hosting, with `Index document` set to `index.html`

### Step 3: Create a AWS CodeBuild Project

- Under Source set `Source provider` to GitHub, and select the react Repo (require connection to GitHub account)
- Under Primary source webhook events - check `Rebuild every time a code is pushed to this repoository` or configure other hooks as necessary.
- Under environment enter a new `Role name` for new service role, in the advanced configuration select compute setting, or add environment variables as necessary
- Under Buildspec - select using `Use a buildspec file`
  - create a buildspec.yml in react repo and push to GitHub.
  - The following is an example buildspec file with `S3_BUCKET` defined in CodeBuild environment variable. The buildspec file defines commands to install dependencies, build the project and uploads the build output to S3 bucket.

```
version: 0.2

cache:
  paths:
    - 'node_modules/**/*'
    - ~/.npm/**/*

env:
  variables:
    S3_BUCKET: 'TO-Be-Defined-By-AWSCodeBuild-Environment-Variable'

phases:
  install:
    runtime-versions:
      nodejs: 20
    commands:
      - rm -rf node_modules package-lock.json
      - echo Installing dependencies...
      - npm install
  build:
    commands:
      - echo Building the project...
      - npm run build
  post_build:
    commands:
      - echo Build completed!!
      - echo Uploading files to S3...
      - echo S3 bucket - $S3_BUCKET
      - aws s3 sync ./dist/react-web-app s3://$S3_BUCKET --delete

```

- enable optional CloudWatch log, and create build project
- Initiate a new push to GitHub should auto trigger CodeBuild and publish to S3!
