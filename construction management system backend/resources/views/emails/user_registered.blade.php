<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Our Platform</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        .email-container {
            width: 90%;
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-top: 5px solid #3498db;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header img {
            width: 120px;
            margin-bottom: 10px;
        }
        h1 {
            color: #2c3e50;
            font-size: 26px;
            margin-bottom: 15px;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
        h2 {
            color: #34495e;
            font-size: 20px;
            margin-top: 20px;
            border-bottom: 1px solid #ecf0f1;
            padding-bottom: 5px;
        }
        p {
            font-size: 16px;
            line-height: 1.6;
            margin: 10px 0;
        }
        .details-section {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
            border: 1px solid #ddd;
        }
        .details-section p {
            margin: 8px 0;
            font-weight: 500;
        }
        .issue-detail {
            margin-top: 10px;
        }
        .issue-detail p {
            margin: 8px 0;
        }
        .issue-detail .issue {
            margin-bottom: 20px; 
            padding-bottom: 10px;
            border-bottom: 1px solid #ddd; 
        }
        .footer {
            margin-top: 30px;
            font-size: 14px;
            color: #666;
            text-align: center;
        }
        .footer a {
            color: #3498db;
            text-decoration: none;
        }
        .footer p {
            margin: 5px 0;
        }

        .project-details p {
            font-size: 12px;
        }
    </style>
</head>


  

<body>
    <div class="email-container">
      
        <h1><strong>Welcome {{ $name }},</strong></h1>
        
        <p>Thank you for signing up with us. We are happy to have you!</p>
        <p>We are providing you with your account details for Vertex Construction. Please review the information below:</p>

        <h2>Account Information</h2>
        <div class="project-details">
            <p><strong>Username:</strong> {{ $name }}</p>
            <p><strong>Role:</strong> {{ $role }}</p>

            <hr /> 
        
         
            <p style="text-decoration: none"><strong>Email Address:</strong> {{ $email }}</p>
            <p><strong>Password:</strong> {{ $password }} </p>
         
        </div>

        <p style="display: inline-block; padding: 10px 20px; color: #ff001e;   border-radius: 5px;">For security reasons, please log in to the system and change your password as soon as possible.</p>

        <div style="display: grid; text-align: center;">
            <p>Click the button to log in to the system:</p> <br/>
            
        </div>

        <div style="display: grid; text-align: center;">
            <a href="http://localhost:3000/login" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">
                Login
            </a>
            
        </div>

       
        

        
        


        <p>If you have any questions or need further assistance, please do not hesitate to contact us.</p>

        <div class="footer">
            <p>Thank you for your attention.</p>
            <p>For support, please reach out to us at <a href="mailto:support@constructvertex.com">support@constructvertex.com</a>.</p>
        </div>
    </div>
</body>


</html>
