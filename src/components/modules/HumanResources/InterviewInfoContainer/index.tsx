"use client";

import React, { useState } from "react";
import { Divider, Steps } from "antd";

import { useParams } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";

import ApplicationInfoModule from "../ApplicationInfoComponent";

import { useGetEngagementByIdQuery } from "@/store/queries/engagementManagement";
import ResultInfoModule from "../ResultInfoComponent";
import CreateInterviewModule from "../CreateInterviewComponent";
import InterviewModule from "../InterviewComponent";

function InterviewInfoModule() {
  const params = useParams();

  const { t } = useTranslation(params?.locale as string, "engagement");

  const { result, isFetching, refetch } = useGetEngagementByIdQuery(
    params?.engagementId,
    {
      selectFromResult: ({ data, isFetching }) => {
        return {
          result: data?.result,
          total: data?.count ?? 0,
          isFetching,
        };
      },
    }
  );

  const [current, setCurrent] = useState(0);

  const steps = [
    {
      id: 0,
      title: t("interviewInfo.overview"),
      content: (
        <ApplicationInfoModule engagement={result} isFetching={isFetching} />
      ),
    },
    {
      id: 1,
      title: t("interviewInfo.createInterview"),
      content: (
        <CreateInterviewModule
          engagement={result}
          isFetching={isFetching}
          refetch={refetch}
        />
      ),
    },
    {
      id: 2,
      title: t("interviewInfo.interview"),
      content: (
        <InterviewModule
          engagement={result}
          isFetching={isFetching}
          refetch={refetch}
        />
      ),
    },
    {
      id: 3,
      title: t("interviewInfo.result"),
      content: (
        <ResultInfoModule
          engagement={result}
          isFetching={isFetching}
          refetch={refetch}
        />
      ),
    },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const onChange = (value: number) => {
    setCurrent(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <Steps
        current={current}
        items={items}
        type="navigation"
        onChange={onChange}
        className="site-navigation-steps"
      />
      <Divider />
      <div style={{ marginTop: 24, marginBottom: 24 }}>
        {steps[current]?.content}
      </div>
    </div>
  );
}

export default InterviewInfoModule;
