from config.signals import userstampable
from django.db.models import signals
from django.utils.functional import curry
from rest_framework import authentication


class UserstampMiddleware(object):
    """Add user created_by and updated_by foreign key refs to any model automatically.
    Almost entirely taken from https://github.com/Atomidata/django-audit-log/blob/master/audit_log/middleware.py"""
    def process_request(self, request):
        #print("UserstampMiddleware")
        if not request.method in ('GET', 'HEAD', 'OPTIONS', 'TRACE'):
            user = request.user
            # it should not happened. LoginRequiredMiddleware is running before.
            if not user.is_authenticated():
                user = None

            func = curry(userstampable, user)

            signals.pre_save.connect(func, dispatch_uid = (self.__class__, request), weak = False)

    def process_response(self, request, response):
        signals.pre_save.disconnect(dispatch_uid = (self.__class__, request))

        return response

"""
Note: To Avoid to repeat this part of code in all the models with created_by
    views.py
    CreateView or UpdateView

    def form_valid(self, form):
        form_class = self.get_form_class()
        form = self.get_form(form_class)
        self.object = form.save(commit=False)
        self.object.created_by = self.request.user
        self.object.save()
        return HttpResponseRedirect(self.get_success_url())
"""
