from django.shortcuts import render

# Create your views here.
@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def test(request):
    return Response({'test': 123321})