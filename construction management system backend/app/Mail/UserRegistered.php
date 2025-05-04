<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Address;

class UserRegistered extends Mailable
{
    use Queueable, SerializesModels;

   public $user; 
   public $password;

    /**
     * Create a new message instance.
     */
    public function __construct($user, $password)
    {
        $this->user = $user;
        $this->password = $password;
        //
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'User Registered',
            from: new Address('achinthas2000@gmail.com', 'Construct Vertex')
        );
    }

    /**
     * Get the message content definition.
     */


    public function build()
    {
        return $this->view('emails.user_registered') 
                    ->subject('Welcome to Our Platform') 
                    ->with([
                       
                        'name' => $this->user->name, 
                        'role' => $this->user->role,
                        'password' => $this->password,
                        // 'position' => $this->user->position,
                        'email' => $this->user->email,
                    ]);
    }
}
