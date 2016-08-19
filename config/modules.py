from django.contrib.auth.models import User

def callbackfunction(tree):
    #print("Call Back Function SSO action")
    username = tree[0][0].text
    user, user_created = User.objects.get_or_create(username=username, email=username)
    #New user.
    if user_created:
        user.disabled = 0
        user.study_manager = 0
        user.is_superuser = 0
        user.is_staff = 0
        user.save()