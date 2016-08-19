from django.conf import settings

def name_instance(request):
    """
    Adds name_instance context variables to the context.
    """
    return {'NAME_INSTANCE': settings.NAME_INSTANCE }
