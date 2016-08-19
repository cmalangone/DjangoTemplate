from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.utils import timezone


@receiver(pre_save)
def timestampable(sender, instance, *args, **kwargs):
    if hasattr(instance, 'created_at'):
        if instance._state.adding and not instance.created_at:
            instance.created_at = timezone.now().replace(microsecond=0)

    if hasattr(instance, 'updated_at'):
        if instance._state.adding or instance.is_dirty():
            instance.updated_at = timezone.now().replace(microsecond=0)


# bound by UserstampMiddleware
def userstampable(user, sender, instance, **kwargs):
    #print("signals.py: userstampable")
    if hasattr(instance, 'created_by_id') and instance._state.adding:
        instance.created_by = user

    if hasattr(instance, 'updated_by_id'):
        instance.updated_by = user