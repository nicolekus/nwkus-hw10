import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, BarChart3, AlertCircle } from "lucide-react";
import { surveySchema, type SurveyPayload, useSubmitSurvey, type SurveyResponse } from "@/hooks/use-survey";
import { Card, Button, Label, ErrorMessage, Input, Select, Textarea } from "@/components/ui-custom";
import { cn } from "@/lib/utils";

const YEAR_OPTIONS = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate Student"];
const FREQUENCY_OPTIONS = ["Never", "Rarely", "Sometimes", "Often", "Very Often"];
const SOURCE_OPTIONS = ["Classes / Homework", "Exams", "Work / Internship", "Money", "Family", "Social Life", "Future / Career"];
const COPING_OPTIONS = ["Sleep", "Exercise", "Talking to Friends", "Watching TV / Movies", "Listening to Music", "Other"];
const SLEEP_OPTIONS = ["Less than 4 hours", "4-5 hours", "6-7 hours", "8-9 hours", "More than 9 hours"];

export default function Survey() {
  const [submittedData, setSubmittedData] = useState<SurveyResponse | null>(null);
  const submitSurvey = useSubmitSurvey();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SurveyPayload>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      year_in_school: "",
      stress_frequency: "",
      stress_source: "",
      coping_methods: [],
      other_coping_text: "",
      sleep_hours: "",
      additional_comments: "",
    },
  });

  const selectedCoping = watch("coping_methods");
  const isOtherSelected = selectedCoping.includes("Other");

  // Auto-focus the "Other" input when it appears
  useEffect(() => {
    if (isOtherSelected) {
      const el = document.getElementById("other_coping_text");
      if (el instanceof HTMLElement) {
        el.focus();
      }
    }
  }, [isOtherSelected]);

  const onSubmit = async (data: SurveyPayload) => {
    try {
      const response = await submitSurvey.mutateAsync(data);
      setSubmittedData(response);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      // Error is handled in the UI via the mutation's error state
    }
  };

  const resetForm = () => {
    reset();
    setSubmittedData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submittedData) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 text-center bg-gradient-to-b from-card to-secondary/20">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black mb-2">Thank you for your response!</h2>
            <p className="text-muted-foreground mb-8">Your anonymous feedback has been recorded securely.</p>

            <div className="bg-card border border-border/50 rounded-xl p-6 mb-8 text-left shadow-sm">
              <h3 className="font-bold text-lg mb-4 border-b border-border/50 pb-2">Your Answers Summary</h3>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-muted-foreground font-medium">Year in School</dt>
                  <dd className="font-semibold text-foreground mt-0.5">{submittedData.year_in_school}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground font-medium">Stress Frequency</dt>
                  <dd className="font-semibold text-foreground mt-0.5">{submittedData.stress_frequency}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground font-medium">Biggest Source of Stress</dt>
                  <dd className="font-semibold text-foreground mt-0.5">{submittedData.stress_source}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground font-medium">Coping Methods</dt>
                  <dd className="font-semibold text-foreground mt-0.5">
                    {submittedData.coping_methods.map(method => 
                      method === "Other" ? submittedData.other_coping_text : method
                    ).join(", ")}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground font-medium">Sleep Hours</dt>
                  <dd className="font-semibold text-foreground mt-0.5">{submittedData.sleep_hours}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground font-medium">Additional Comments</dt>
                  <dd className="font-semibold text-foreground mt-0.5">{submittedData.additional_comments}</dd>
                </div>
              </dl>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={resetForm} variant="outline" className="w-full sm:w-auto">
                Submit Another Response
              </Button>
              <Link href="/results" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto">
                  <BarChart3 className="mr-2 w-4 h-4" />
                  View Results
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground">Survey Questionnaire</h1>
          <p className="text-muted-foreground mt-1">Please answer all questions honestly.</p>
        </div>
        <Link href="/results">
          <Button variant="secondary" className="px-4 py-2 text-sm">
            <BarChart3 className="mr-2 w-4 h-4" />
            View Results
          </Button>
        </Link>
      </div>

      <Card className="p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          
          {/* Q1: Year in School */}
          <div>
            <Label htmlFor="year_in_school" required>1. What is your year in school?</Label>
            <Select 
              id="year_in_school"
              options={YEAR_OPTIONS}
              error={!!errors.year_in_school}
              aria-invalid={!!errors.year_in_school}
              aria-describedby={errors.year_in_school ? "year-error" : undefined}
              {...register("year_in_school")}
            />
            <ErrorMessage id="year-error" message={errors.year_in_school?.message} />
          </div>

          {/* Q2: Stress Frequency */}
          <fieldset aria-describedby={errors.stress_frequency ? "frequency-error" : undefined}>
            <legend className="block text-sm font-bold text-foreground mb-2">
              2. How often do you feel stressed during a normal school week?
              <span className="text-destructive ml-1" aria-hidden="true">*</span>
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3">
              {FREQUENCY_OPTIONS.map((option) => {
                const optionId = `stress_frequency_${option.toLowerCase().replace(/\s+/g, '_')}`;
                return (
                  <label 
                    key={option}
                    htmlFor={optionId}
                    className={cn(
                      "flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200",
                      "hover:bg-primary/5",
                      watch("stress_frequency") === option 
                        ? "border-primary bg-primary/5 shadow-sm" 
                        : "border-border bg-background",
                      errors.stress_frequency && "border-destructive/50 hover:border-destructive"
                    )}
                  >
                    <input
                      type="radio"
                      id={optionId}
                      value={option}
                      className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                      {...register("stress_frequency")}
                    />
                    <span className="ml-3 font-medium text-sm text-foreground">{option}</span>
                  </label>
                );
              })}
            </div>
            <ErrorMessage id="frequency-error" message={errors.stress_frequency?.message} />
          </fieldset>

          {/* Q3: Stress Source */}
          <div>
            <Label htmlFor="stress_source" required>3. What is your biggest source of stress?</Label>
            <Select 
              id="stress_source"
              options={SOURCE_OPTIONS}
              error={!!errors.stress_source}
              aria-invalid={!!errors.stress_source}
              aria-describedby={errors.stress_source ? "source-error" : undefined}
              {...register("stress_source")}
            />
            <ErrorMessage id="source-error" message={errors.stress_source?.message} />
          </div>

          {/* Q4: Coping Methods */}
          <fieldset aria-describedby={errors.coping_methods ? "coping-error" : undefined}>
            <legend className="block text-sm font-bold text-foreground mb-2">
              4. What do you usually do to cope with stress? (Select all that apply)
              <span className="text-destructive ml-1" aria-hidden="true">*</span>
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {COPING_OPTIONS.map((option) => {
                const optionId = `coping_${option.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;
                return (
                  <label 
                    key={option}
                    htmlFor={optionId}
                    className={cn(
                      "flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200",
                      "hover:bg-primary/5",
                      selectedCoping.includes(option)
                        ? "border-primary bg-primary/5 shadow-sm" 
                        : "border-border bg-background",
                      errors.coping_methods && "border-destructive/50 hover:border-destructive"
                    )}
                  >
                    <input
                      type="checkbox"
                      id={optionId}
                      value={option}
                      className="w-5 h-5 rounded text-primary border-gray-300 focus:ring-primary"
                      {...register("coping_methods")}
                    />
                    <span className="ml-3 font-medium text-sm text-foreground">{option}</span>
                  </label>
                );
              })}
            </div>
            <ErrorMessage id="coping-error" message={errors.coping_methods?.message} />

            <AnimatePresence>
              {isOtherSelected && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden"
                >
                  <Label htmlFor="other_coping_text" required>Please describe your other coping method:</Label>
                  <Input
                    id="other_coping_text"
                    placeholder="e.g. Yoga, Gaming, Reading..."
                    error={!!errors.other_coping_text}
                    aria-invalid={!!errors.other_coping_text}
                    aria-describedby={errors.other_coping_text ? "other-coping-error" : undefined}
                    {...register("other_coping_text")}
                  />
                  <ErrorMessage id="other-coping-error" message={errors.other_coping_text?.message} />
                </motion.div>
              )}
            </AnimatePresence>
          </fieldset>

          {/* Q5: Sleep Hours */}
          <div>
            <Label htmlFor="sleep_hours" required>5. About how many hours of sleep do you get on a typical night?</Label>
            <Select 
              id="sleep_hours"
              options={SLEEP_OPTIONS}
              error={!!errors.sleep_hours}
              aria-invalid={!!errors.sleep_hours}
              aria-describedby={errors.sleep_hours ? "sleep-error" : undefined}
              {...register("sleep_hours")}
            />
            <ErrorMessage id="sleep-error" message={errors.sleep_hours?.message} />
          </div>

          {/* Q6: Additional Comments */}
          <div>
            <Label htmlFor="additional_comments" required>6. Is there anything else you want to share about student stress?</Label>
            <Textarea 
              id="additional_comments"
              placeholder="Share anything else here"
              error={!!errors.additional_comments}
              aria-invalid={!!errors.additional_comments}
              aria-describedby={errors.additional_comments ? "comments-error" : undefined}
              {...register("additional_comments")}
            />
            <ErrorMessage id="comments-error" message={errors.additional_comments?.message} />
          </div>

          {/* Submit Error */}
          {submitSurvey.error && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3 text-destructive">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Failed to submit survey</h4>
                <p className="text-sm mt-1 opacity-90">{submitSurvey.error.message}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-6 border-t border-border/50">
            <Button 
              type="submit" 
              className="w-full text-lg py-4" 
              disabled={isSubmitting || submitSurvey.isPending}
            >
              {isSubmitting || submitSurvey.isPending ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Submit Survey
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
