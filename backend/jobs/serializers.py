from rest_framework import serializers
from .models import Job, JobApplication

class JobSerializer(serializers.ModelSerializer):
    employer_name = serializers.ReadOnlyField(source='employer.email')

    class Meta:
        model = Job
        fields = [
            'id', 'title', 'description', 'company_name', 'location', 
            'job_type', 'salary_min', 'salary_max', 'employer', 
            'employer_name', 'created_at', 'is_active'
        ]
        read_only_fields = ['employer', 'created_at']

class JobApplicationSerializer(serializers.ModelSerializer):
    applicant_email = serializers.ReadOnlyField(source='applicant.email')
    job_title = serializers.ReadOnlyField(source='job.title')
    company_name = serializers.ReadOnlyField(source='job.company_name')

    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'job_title', 'company_name', 'applicant', 
            'applicant_email', 'cover_letter', 'resume_url', 
            'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['applicant', 'status', 'created_at', 'updated_at']
