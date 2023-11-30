<?php


namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validatedData = $request->validate([
            'name' => '',
            'email' => 'email|required|unique:users',
            'password' => 'required'
        ]);

        $validatedData['password'] = Hash::make($validatedData['password']);


        $user = User::create($validatedData);

        $credentials = $request->validate([
            'email' => 'email|required',
            'password' => 'required',
        ]);

        if ($token = Auth::attempt($credentials)) {
            $user = Auth::user();

            $user->tokens()->delete();
            $token = $user->createToken($token)->plainTextToken;
            User::where('id', $user->id)
                ->update(['api_token' => $token]);
            $user = User::find($user->id);
        }


        return response()->json(['user' => $user, 'token' => $token]);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'email|required',
            'password' => 'required',
        ]);

        if ($token = Auth::attempt($credentials)) {
            $user = Auth::user();

            $user->tokens()->delete();
            //$userID = $user->id;
            // генерация токена для пользователя

            $token = $user->createToken($token)->plainTextToken;
            User::where('id', $user->id)
                ->update(['api_token' => $token]);
            $user = User::find($user->id);

            return response()->json(['token' => $token,'user' => ['user_id' =>$user->id]], 200);
        }

        return response()->json(['error' => 'Unauthorized'], 401);
    }

    public function profile(Request $request)
    {
        $token = $request->header('Authorization');
        /*return response()->json( [
            'token' => $token,
            'Authorization' => $request->header('Authorization'),
        ]);*/
        if (!$token) {
            return response()->json(['error' => 'Token not provided'], 401);
        }

        $user = Auth::guard('api')->user();

        if (!$user) {
            return response()->json(['error' => 'Invalid token'], 401);
        }
        return response()->json( ['user_info' => $user],200);
    }

    private function createJwtToken($user_id)
    {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        // Create token payload as a JSON string
        $payload = json_encode(['user_id' => $user_id]);
        // Encode Header to Base64Url String
        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        // Encode Payload to Base64Url String
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
        // Create Signature Hash
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, 'HiGZYIdw9nl5uRLigzA1dZfj7gNDHbN6', true);
        // Encode Signature to Base64Url String
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        // Create JWT
        $jwt = $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;

        return $jwt;
    }
}
