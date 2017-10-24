// @flow

import * as React from 'react';
import Chart from 'components/Chart';
import type { TransactionSummary } from 'selectors/transactions';
import { arc, pie } from 'd3';
import Path from 'components/DonutChart/Path';
import styles from './styles.scss';

type DonutChartProps = {
  data: TransactionSummary[],
  dataLabel: string,
  dataKey: string,
  dataValue: string,
  height: number,
  innerRatio: number,
};

class DonutChart extends React.Component<DonutChartProps> {
  static defaultProps = {
    height: 300,
    innerRatio: 4,
    dataValue: 'value',
  };

  componentWillMount() {
    this.updateChartVariables();
  }

  componentWillReceiveProps(nextProps: DonutChartProps) {
    const { data, height } = nextProps;

    const old = this.props;

    if (old.data !== data || old.height !== height) {
      this.updateChartVariables();
    }
  }

  getPathArc = () => {
    const { height, innerRatio } = this.props;
    return arc()
      .innerRadius(height / innerRatio)
      .outerRadius(height / 2);
  };

  chart: any;
  pathArc: any;
  outerRadius: number;
  boxLength: number;
  chartPadding = 8;

  updateChartVariables = () => {
    const { data, dataValue, height } = this.props;

    this.chart = pie()
      .value(d => d[dataValue])
      .sort(null);
    this.outerRadius = height / 2;
    this.pathArc = this.getPathArc();
    this.boxLength = height + this.chartPadding * 2;
  };

  render() {
    const { data, dataLabel, dataValue, dataKey, colors } = this.props;
    const { outerRadius, pathArc, boxLength, chartPadding } = this;

    return (
      <div className={styles.pieChart}>
        <Chart
          width={boxLength}
          height={boxLength}
          padding={chartPadding}
          transform={`translate(${outerRadius},${outerRadius})`}
        >
          {this.chart(data).map((datum, index) => (
            <Path data={datum} index={index} fill={datum.data.color || '#9E9E9E'} arcFn={pathArc} key={datum.data[dataKey]} />
          ))}
        </Chart>
      </div>
    );
  }
}

export default DonutChart;
