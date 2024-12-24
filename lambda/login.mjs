const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const { username, password, email } = JSON.parse(event.body);
    const params = {
        TableName: "UsersTable", // Replace with your DynamoDB table name
        Item: {
            username: username,
            password: password, // Hash passwords in a real-world scenario
            email: email,
            createdAt: Date.now(),
            userid: Math.random().toString(36).substring(2) + Date.now().toString
        },
    };

    try {
        await dynamoDB.put(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "User registered successfully!" }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error registering user", error }),
        };
    }
};
