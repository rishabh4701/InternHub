import pdb
import requests
import random
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializer import DataSerializer, LoginSerializer, CustomUserSerializer, OTPVerificationSerializer
from .models import CustomUser
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework import generics, status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from rest_framework.views import APIView

# Create your views here.

class VerifyOTPView(APIView):
    def post(self, request, *args, **kwargs):
        otp_data = request.data.get('otpData')  # Extract the otpData dictionary
        if not otp_data:
            return Response({"detail": "Invalid data format"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = OTPVerificationSerializer(data=otp_data)
        if serializer.is_valid():
            return Response({"detail": "OTP verified successfully."}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class SendEmailView(APIView):
    """
    API view to handle sending emails.
    """
    def post(self, request, *args, **kwargs):
        # Extract email data from the request
        email = request.data.get('email')
        subject = request.data.get('subject')
        message = request.data.get('message')

        # Validate email data
        if not email or not subject or not message:
            return JsonResponse({'error': 'Missing email, subject, or message.'}, status=status.HTTP_400_BAD_REQUEST)

        # Send the email
        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,  # From email
                [email],  # To email
                fail_silently=False,
            )
            return JsonResponse({'message': 'Email sent successfully!'}, status=status.HTTP_200_OK)
        except Exception as e:
            return JsonResponse({'error': f'Failed to send email: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserListView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    # permission_classes = [IsAuthenticated]
    lookup_field = 'pk'  # Specify the lookup field for retrieving the user


    def put(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()

class RegisterView(generics.CreateAPIView):
    """
    API view for user registration with reCAPTCHA validation and email sending.
    """
    queryset = CustomUser.objects.all()
    serializer_class = DataSerializer

    def create(self, request, *args, **kwargs):

        # reCAPTCHA verification
        recaptcha_token = request.data.get('recaptchaToken')
        if not recaptcha_token:
            return Response({'error': 'reCAPTCHA token is missing'}, status=status.HTTP_400_BAD_REQUEST)

        recaptcha_response = requests.post(
            'https://www.google.com/recaptcha/api/siteverify',
            data={
                'secret': settings.RECAPTCHA_SECRET_KEY,
                'response': recaptcha_token
            }
        )
        result = recaptcha_response.json()

        if not result.get('success'):
            return Response({'error': 'reCAPTCHA verification failed'}, status=status.HTTP_400_BAD_REQUEST)

        # Proceed with the registration
        response = super().create(request, *args, **kwargs)

        print("Response : ", response)

        # Send welcome email after successful registration
        user_email = request.data.get('email')

        if user_email:
            subject = 'Welcome to Our Service'
            message = f"Here is the OTP for your registration : {response.data['otp_verification']}"

            # message = 'Dear {},\n\nThank you for registering with us.\n\nBest regards,\nThe Team'.format(request.data.get('first_name'))
            try:
                send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user_email])
            except Exception as e:
                return Response({'error': f'Failed to send email: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({'error': 'Email address is missing'}, status=status.HTTP_400_BAD_REQUEST)

        return response

class LoginView(generics.GenericAPIView):
    """
    API view for user login with reCAPTCHA validation.
    """
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        # reCAPTCHA verification
        recaptcha_token = request.data.get('recaptchaToken')
        if not recaptcha_token:
            return Response({'error': 'reCAPTCHA token is missing'}, status=status.HTTP_400_BAD_REQUEST)

        recaptcha_response = requests.post(
            'https://www.google.com/recaptcha/api/siteverify',
            data={
                'secret': settings.RECAPTCHA_SECRET_KEY,
                'response': recaptcha_token
            }
        )
        result = recaptcha_response.json()

        if not result.get('success'):
            return Response({'error': 'reCAPTCHA verification failed'}, status=status.HTTP_400_BAD_REQUEST)

        # If reCAPTCHA is successful, proceed with the login
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password']
        )

        if user:
            refresh = RefreshToken.for_user(user)
            user_status = "none"
            if user.is_superuser:
                user_status = "superuser"
            elif user.is_staff:
                user_status = "staff"
            
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_id': user.id,
                'username': user.username,
                'status': user_status,
            }, status=status.HTTP_200_OK)

        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
# @api_view(['POST'])
# def login(request):
#     serializer = LoginSerializer(data=request.data)
#     if serializer.is_valid():
#         user = authenticate(username=serializer.data['username'], password=serializer.data['password'])
#         if user:
#             token, created = Token.objects.get_or_create(user=user)
#             return Response({'token': token.key})
#         else:
#             return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# from django.contrib.auth import authenticate

# user = authenticate(username='testuser', password='testpassword')
# if user:
#     print("User authenticated successfully.")
# else:
#     print("Authentication failed.")
