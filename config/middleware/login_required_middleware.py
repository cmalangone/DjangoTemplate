from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from django.conf import settings
from re import compile

EXEMPT_URLS = [compile(settings.LOGIN_URL.lstrip('/'))]
if hasattr(settings, 'LOGIN_EXEMPT_URLS'):
    EXEMPT_URLS += [compile(expr) for expr in settings.LOGIN_EXEMPT_URLS]

class LoginRequiredMiddleware:
    """
    Middleware that requires a user to be authenticated to view any page other
    than LOGIN_URL. Exemptions to this requirement can optionally be specified
    in settings via a list of regular expressions in LOGIN_EXEMPT_URLS (which
    you can copy from your urls.py).

    Requires authentication middleware and template context processors to be
    loaded. You'll get an error if they aren't.
    """
    def process_request(self, request):
        #print("LoginRequiredMiddleware")
        assert hasattr(request, 'user'), "The Login Required middleware\
 requires authentication middleware to be installed. Edit your\
 MIDDLEWARE_CLASSES setting to insert\
 'django.contrib.auth.middleware.AuthenticationMiddleware'. If that doesn't\
 work, ensure your TEMPLATE_CONTEXT_PROCESSORS setting includes\
 'django.core.context_processors.auth'."
        #print(request.user.has_perm('managements.add_role'))
        if not request.user.is_authenticated():
            path = request.path_info.lstrip('/')
            if not any(m.match(path) for m in EXEMPT_URLS):
                return HttpResponseRedirect(settings.LOGIN_URL)
        else:
            #print("sample manager control")
            request.user.is_smn = False
            sample_managers_list = User.objects.filter(groups__role__code='SMN').distinct()
            if request.user in sample_managers_list:
                request.user.is_smn = True

            path = request.path_info.lstrip('/')
            if not any(m.match(path) for m in EXEMPT_URLS):
                u_groups =request.user.groups.all()
                if u_groups.count() < 1:
                    if request.user.is_superuser == False and request.user.study_manager == False:
                        return HttpResponseRedirect(settings.GUEST_URL)
