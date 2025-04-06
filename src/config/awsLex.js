import AWS from "aws-sdk";

// Replace with your actual identity pool details
const REGION = "ap-northeast-2";
const IDENTITY_POOL_ID = "ap-northeast-2:7d24c3b0-95b9-4ff3-874d-e046683b6211";

// Configure AWS globally
AWS.config.update({
  region: REGION,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IDENTITY_POOL_ID,
  }),
});

// Export LexRuntimeV2 instance
const lexruntime = new AWS.LexRuntimeV2();

export { lexruntime };
