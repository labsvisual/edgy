import gulp from 'gulp';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import del from 'del';
import ava from 'gulp-ava';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';
import webpack from 'webpack';
import webpackConfig from './webpack.config.babel';
import utils from 'gulp-util';
import info from './package.json';

const paths = {
    source: './lib/**/*.js',
    destination: './build',
    tests: './tests/node/**/*.js',
};

gulp.task( 'test', () => {

    return gulp.src( paths.tests )
            .pipe( plumber() )
            .pipe( ava( {
                verbose: true
            } ) );

} );

gulp.task( 'clean', () => {
    return del( [ paths.destination ] );
} );

gulp.task( 'webpack', gulp.series( 'clean', ( done ) => {

    webpack( webpackConfig, ( err, stats ) => {

        if ( err ) {
            console.error( '[webpack]', err )
            done();
            return;
        }
        utils.log( '[webpack]', stats.toString( {
            colors: true,
            progress: true
        } ) );

        done();

    } );

} ) );

gulp.task( 'watch', () => {

    gulp.watch( paths.source, gulp.series( 'webpack' ) );
    gulp.watch( paths.tests, gulp.series( 'test' ) );

} );

gulp.task( 'default', gulp.series( 'watch' ) );
