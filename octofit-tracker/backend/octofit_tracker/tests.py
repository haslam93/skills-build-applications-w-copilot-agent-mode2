from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import User, Team, Activity, Leaderboard, Workout


class TeamModelTest(TestCase):
    def setUp(self):
        self.team = Team.objects.create(name='Test Team')

    def test_team_creation(self):
        self.assertEqual(self.team.name, 'Test Team')
        self.assertEqual(str(self.team), 'Test Team')


class UserModelTest(TestCase):
    def setUp(self):
        self.team = Team.objects.create(name='Test Team')
        self.user = User.objects.create(
            name='Test User',
            email='test@example.com',
            team=self.team
        )

    def test_user_creation(self):
        self.assertEqual(self.user.name, 'Test User')
        self.assertEqual(self.user.email, 'test@example.com')
        self.assertEqual(self.user.team, self.team)


class ActivityModelTest(TestCase):
    def setUp(self):
        self.team = Team.objects.create(name='Test Team')
        self.user = User.objects.create(
            name='Test User',
            email='test@example.com',
            team=self.team
        )
        self.activity = Activity.objects.create(
            user=self.user,
            type='Running',
            duration=30
        )

    def test_activity_creation(self):
        self.assertEqual(self.activity.user, self.user)
        self.assertEqual(self.activity.type, 'Running')
        self.assertEqual(self.activity.duration, 30)


class WorkoutModelTest(TestCase):
    def setUp(self):
        self.workout = Workout.objects.create(
            name='Test Workout',
            description='Test Description'
        )

    def test_workout_creation(self):
        self.assertEqual(self.workout.name, 'Test Workout')
        self.assertEqual(self.workout.description, 'Test Description')


class LeaderboardModelTest(TestCase):
    def setUp(self):
        self.team = Team.objects.create(name='Test Team')
        self.leaderboard = Leaderboard.objects.create(
            team=self.team,
            points=100
        )

    def test_leaderboard_creation(self):
        self.assertEqual(self.leaderboard.team, self.team)
        self.assertEqual(self.leaderboard.points, 100)


class TeamAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.team = Team.objects.create(name='Test Team')

    def test_get_teams(self):
        response = self.client.get('/api/teams/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_team(self):
        response = self.client.post('/api/teams/', {'name': 'New Team'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class UserAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.team = Team.objects.create(name='Test Team')
        self.user = User.objects.create(
            name='Test User',
            email='test@example.com',
            team=self.team
        )

    def test_get_users(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_user(self):
        response = self.client.post('/api/users/', {
            'name': 'New User',
            'email': 'newuser@example.com',
            'team': self.team.id
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class ActivityAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.team = Team.objects.create(name='Test Team')
        self.user = User.objects.create(
            name='Test User',
            email='test@example.com',
            team=self.team
        )

    def test_get_activities(self):
        response = self.client.get('/api/activities/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_activity(self):
        response = self.client.post('/api/activities/', {
            'user': self.user.id,
            'type': 'Running',
            'duration': 30
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class LeaderboardAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.team = Team.objects.create(name='Test Team')

    def test_get_leaderboard(self):
        response = self.client.get('/api/leaderboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_leaderboard(self):
        response = self.client.post('/api/leaderboard/', {
            'team': self.team.id,
            'points': 100
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class WorkoutAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_get_workouts(self):
        response = self.client.get('/api/workouts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_workout(self):
        response = self.client.post('/api/workouts/', {
            'name': 'Test Workout',
            'description': 'Test Description'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
