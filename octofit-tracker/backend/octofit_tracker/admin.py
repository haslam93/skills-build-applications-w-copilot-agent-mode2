from django.contrib import admin
from .models import User, Team, Activity, Leaderboard, Workout


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    search_fields = ['name']


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'email', 'team']
    list_filter = ['team']
    search_fields = ['name', 'email']


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'type', 'duration', 'timestamp']
    list_filter = ['type', 'timestamp']
    search_fields = ['user__name', 'type']
    date_hierarchy = 'timestamp'


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'description']
    search_fields = ['name', 'description']
    filter_horizontal = ['suggested_for']


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ['id', 'team', 'points']
    list_filter = ['team']
    search_fields = ['team__name']
