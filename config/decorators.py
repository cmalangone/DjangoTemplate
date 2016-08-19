
from django.utils import six
from django.core.exceptions import PermissionDenied
from django.contrib.auth.decorators import user_passes_test

#How to use it:
#@method_decorator(authorization_required(('locations.add_location','app.codename'), login_url="/403"))
#@method_decorator(authorization_required('locations.add_location', login_url="/403"))

def authorization_required(permission, login_url=None, raise_exception=False):
    """
    Decorator for views that checks whether a user has a group permission,
    redirecting to the url page if necessary. (often 403)
    If the raise_exception parameter is given the PermissionDenied exception
    is raised.
    """
    def check_perms(user):
        if user.is_superuser:
            print("SuperUser")
            return True
        if isinstance(permission, six.string_types):
            permissions = (permission, )
        else:
            permissions = permission

        user_permissions = user.get_all_permissions()  #this is a set
        has_permission = user_permissions & set(permissions)  #return the matches
        if has_permission:
            return True
        # In case the 403 handler should be called raise the exception
        if raise_exception:
            raise PermissionDenied

        return False
    return user_passes_test(check_perms, login_url=login_url)

def read_permission_required(permission, login_url=None, raise_exception=False):
    """
    Decorator for views that checks whether a user has a READ permission for the study,
    redirecting to the url page if necessary. (often 403)
    If the raise_exception parameter is given the PermissionDenied exception
    is raised.
    """
    def check_perms(user):
        #if user.is_superuser:
        #    return True
        print("dentro read_permission")
        print(pk)
        return True

    return user_passes_test(check_perms, login_url=login_url)
