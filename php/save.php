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
   
    

 