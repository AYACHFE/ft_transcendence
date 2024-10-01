from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponseRedirect


class NotAuthMixin(LoginRequiredMixin):
    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return HttpResponseRedirect("/dashboard/")
        return super().dispatch(request, *args, **kwargs)
    
class AuthRequired(LoginRequiredMixin):
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return HttpResponseRedirect("/login")
        return super().dispatch(request, *args, **kwargs)



class AuthRequired(LoginRequiredMixin):
    """Verify that the current user is authenticated."""

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return HttpResponseRedirect("/login")
        return super().dispatch(request, *args, **kwargs)