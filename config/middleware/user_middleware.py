from django.contrib.auth.models import User


#This middleware allows you to force a user. Waiting to test with Ian the chance to query the system.  (SSO)

class UserMiddleware:
    def process_request(self, request):
        #print("UserMiddleware Empty")
        print(request.user)

        #forced_user = User.objects.get(pk=36) #35
        #if forced_user:
        #    request.user = forced_user
        #    print("=============================")
        #    print("USER FORCED TO: "+forced_user.username)
        #    print("=============================")
