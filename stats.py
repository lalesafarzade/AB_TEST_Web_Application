import numpy as np
from statsmodels.stats.proportion import proportions_ztest
import scipy.stats as stats

def run_ztest(df):
    summary = df.groupby("group")["converted"].agg(["sum", "count"])

    conversions = summary["sum"].values
    nobs = summary["count"].values

    z_stat, p_value = proportions_ztest(conversions, nobs)

    return summary, z_stat, p_value


def confidence_interval(p, n, alpha=0.05):
    z = stats.norm.ppf(1 - alpha/2)
    se = np.sqrt(p * (1 - p) / n)

    return (p - z * se, p + z * se)