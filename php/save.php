

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>register</title>

    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
    />


    <link rel="stylesheet" href="../css/style.css" />

    <script src="../js/" defer></script>
  </head>
  <body>

    
 

    <section class="heading">
      <h1>account</h1>
      <p><a href="home.php">home</a> >> register</p>
    </section>

  <?php
    $errname=$erremail=$errmessage='';
    $name=$email=$message='';
    if(isset($_POST['submit'])){
        $name=$_POST['name'];
       
        $email=$_POST['email'];
       
        $message=$_POST['message'];
       
        if(empty($name)){
            $errname="Empty Field";

        }
        else if(empty($email)){
            $erremail="Empty Field"."<br>";
        }
        else if(!filter_var($email,FILTER_VALIDATE_EMAIL)){
                $erremail="email is not in proper format". "<br>";
        }
        else if(empty($message)){
          $errmessage="Empty Field"."<br>";
        }
       
        else {
    
    $conn=mysqli_connect('localhost','root','','contact');
    // check connection
    if(!$conn){
        die("Connection failed: ". mysqli_connect_errno() );
    }
    $sql="INSERT INTO data(name,email,message)
    VALUES('$name','$email','$message')";
    if(mysqli_query($conn,$sql)){
       //after submission

    }
    else{
        echo "Error:". $sql. "<br>". mysqli_error($conn);
    }
    }
  }
  
    ?>
   
    <section class="register-form">
    <form method="POST" action="<?php echo$_SERVER['PHP_SELF']?>">
        <h3>register now</h3>
        <div class="inputBox">
          <span class="fas fa-user"></span>
          <input type="text" name="name" placeholder="enter your name" id="" />
          <span class="error"> <?php echo $errname ?> </span>
        </div>
        <div class="inputBox">
          <span class="fas fa-envelope"></span>
          <input type="email" name="email" placeholder="enter your email" id="" />
          <span class="error"> <?php echo $erremail ?> </span>
        </div>
        <div class="inputBox">
          <span class="fas fa-lock"></span>
          <input
            type="password"
            name="pass"
            placeholder="enter your password"
            id=""
          />
          <span class="error"> <?php echo $errmessage ?> </span>
        </div>
       
        <input type="submit" name="submit" value="sign up" class="btn" />
      </form>
    </section>

    
  </body>
</html>